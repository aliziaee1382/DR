import React, { useState, useEffect, useRef } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  FileText,
  Clock,
  Sparkles,
  Maximize2,
  Paperclip,
  Send,
  PhoneCall,
  UserCheck
} from 'lucide-react';

interface VideoCallModalProps {
  appointmentId: string;
  doctorName: string;
  doctorAvatar: string;
  patientName: string;
  onClose: () => void;
  onOpenPrescription?: () => void;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  appointmentId,
  doctorName,
  doctorAvatar,
  patientName,
  onClose,
  onOpenPrescription
}) => {
  const { isConnected, sendSocketPayload, subscribeSocketEvent } = useRealtime();
  const { currentUser, currentRole, chatMessages, sendChatMessage } = useApp();

  const messages = chatMessages[appointmentId] || [];

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showSideChat, setShowSideChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [peerConnected, setPeerConnected] = useState(false);
  const [peerName, setPeerName] = useState<string>(
    currentRole === 'doctor' ? patientName : doctorName
  );
  const [peerVideoOff, setPeerVideoOff] = useState(false);
  const [isCalling, setIsCalling] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  // Format Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const createPeerConnection = () => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    // Attach local stream tracks to PC
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle incoming remote track
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
        setPeerConnected(true);
        setIsCalling(false);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSocketPayload({
          type: 'webrtc_ice_candidate',
          appointmentId,
          candidate: event.candidate.toJSON(),
          senderId: currentUser.id
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setPeerConnected(true);
        setIsCalling(false);
      } else if (
        pc.connectionState === 'disconnected' ||
        pc.connectionState === 'failed' ||
        pc.connectionState === 'closed'
      ) {
        setPeerConnected(false);
      }
    };

    return pc;
  };

  const startLocalMedia = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        return stream;
      }
    } catch (err) {
      console.warn('Camera/Microphone access error or permission denied:', err);
    }
    return null;
  };

  const initiateCall = async () => {
    const pc = createPeerConnection();
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      sendSocketPayload({
        type: 'webrtc_offer',
        appointmentId,
        offer,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentRole
      });
    } catch (err) {
      console.error('Error creating WebRTC offer:', err);
    }
  };

  // Setup media and socket signaling listeners
  useEffect(() => {
    let mounted = true;

    async function setupCall() {
      await startLocalMedia();

      if (!mounted) return;

      // Announce joining call
      sendSocketPayload({
        type: 'webrtc_start_call',
        appointmentId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentRole
      });

      // Initiate call after brief delay to allow second peer connection setup
      setTimeout(() => {
        if (mounted) {
          initiateCall();
        }
      }, 1000);
    }

    setupCall();

    const unsubscribe = subscribeSocketEvent(async (data: any) => {
      if (data.appointmentId !== appointmentId || data.senderId === currentUser.id) {
        return;
      }

      switch (data.type) {
        case 'webrtc_start_call': {
          setPeerName(data.senderName || (currentRole === 'doctor' ? patientName : doctorName));
          // If a new peer arrives, create offer to connect
          initiateCall();
          break;
        }

        case 'webrtc_offer': {
          const pc = createPeerConnection();
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

            // Process buffered ICE candidates
            while (pendingCandidatesRef.current.length > 0) {
              const cand = pendingCandidatesRef.current.shift();
              if (cand) await pc.addIceCandidate(new RTCIceCandidate(cand));
            }

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            sendSocketPayload({
              type: 'webrtc_answer',
              appointmentId,
              answer,
              senderId: currentUser.id
            });

            setPeerConnected(true);
            setIsCalling(false);
          } catch (err) {
            console.error('Error handling WebRTC offer:', err);
          }
          break;
        }

        case 'webrtc_answer': {
          if (peerConnectionRef.current) {
            try {
              await peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(data.answer)
              );
              setPeerConnected(true);
              setIsCalling(false);

              while (pendingCandidatesRef.current.length > 0) {
                const cand = pendingCandidatesRef.current.shift();
                if (cand) {
                  await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(cand));
                }
              }
            } catch (err) {
              console.error('Error setting remote answer:', err);
            }
          }
          break;
        }

        case 'webrtc_ice_candidate': {
          if (
            peerConnectionRef.current &&
            peerConnectionRef.current.remoteDescription &&
            peerConnectionRef.current.remoteDescription.type
          ) {
            try {
              await peerConnectionRef.current.addIceCandidate(
                new RTCIceCandidate(data.candidate)
              );
            } catch (err) {
              console.error('Error adding ICE candidate:', err);
            }
          } else {
            pendingCandidatesRef.current.push(data.candidate);
          }
          break;
        }

        case 'webrtc_media_state': {
          if (data.isVideoOff !== undefined) {
            setPeerVideoOff(data.isVideoOff);
          }
          break;
        }

        case 'webrtc_end_call': {
          setPeerConnected(false);
          break;
        }

        default:
          break;
      }
    });

    return () => {
      mounted = false;
      unsubscribe();

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      sendSocketPayload({
        type: 'webrtc_end_call',
        appointmentId,
        senderId: currentUser.id
      });
    };
  }, [appointmentId, currentUser.id]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = isMuted));
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    const nextVideoOff = !isVideoOff;
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !nextVideoOff));
    }
    setIsVideoOff(nextVideoOff);

    sendSocketPayload({
      type: 'webrtc_media_state',
      appointmentId,
      senderId: currentUser.id,
      isVideoOff: nextVideoOff
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(appointmentId, chatInput);
    setChatInput('');
  };

  const remoteAvatar = currentRole === 'doctor' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' : doctorAvatar;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Top Header Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2.5 sm:px-6 sm:py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src={remoteAvatar}
              alt={peerName}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-teal-500 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-white font-bold text-xs sm:text-sm truncate">{peerName}</h3>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
                <span
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
                    peerConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'
                  }`}
                />
                <span className={`truncate ${peerConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {peerConnected ? 'اتصال تصویری زنده' : 'در حال ارتباط...'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="bg-slate-800 text-slate-200 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1 sm:gap-1.5 border border-slate-700">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" />
              <span>{formatDuration(callDuration)}</span>
            </div>

            {onOpenPrescription && (
              <button
                onClick={onOpenPrescription}
                className="bg-teal-600/20 text-teal-300 hover:bg-teal-600/30 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium border border-teal-500/30 flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">مشاهده نسخه</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Video Display Screen Area */}
        <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Remote Video Element */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${peerConnected && !peerVideoOff ? 'block' : 'hidden'}`}
          />

          {/* Placeholder / Waiting Banner if peer isn't sending video */}
          {(!peerConnected || peerVideoOff) && (
            <div className="absolute inset-0 flex items-center justify-start p-3 sm:p-4 overflow-hidden">
              <img
                src={remoteAvatar}
                alt={peerName}
                className="w-full h-full object-cover opacity-30 filter blur-md scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />

              <div className="relative z-10 flex flex-col items-center justify-center text-center p-3 sm:p-6 bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-700/60 w-[60vw] max-w-[210px] sm:max-w-md shadow-2xl mr-3 sm:mx-auto">
                <div className="relative mb-2 sm:mb-4">
                  <img
                    src={remoteAvatar}
                    alt={peerName}
                    className="w-12 h-12 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-teal-500/80 shadow-2xl"
                  />
                  {!peerConnected && (
                    <span className="absolute -bottom-1 -right-1 bg-amber-500 p-1 sm:p-2 rounded-full animate-bounce shadow-lg">
                      <PhoneCall className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-slate-950" />
                    </span>
                  )}
                </div>

                <h2 className="text-white font-bold text-xs sm:text-lg">{peerName}</h2>
                <p className="text-[10px] sm:text-xs text-slate-300 mt-1 sm:mt-2 leading-relaxed">
                  {peerConnected && peerVideoOff
                    ? 'دوربین طرف مقابل غیرفعال شد.'
                    : 'در حال انتظار برای ورود همزمان...'}
                </p>

                {!peerConnected && (
                  <button
                    onClick={initiateCall}
                    className="mt-2 sm:mt-4 bg-teal-600 hover:bg-teal-700 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-4 sm:py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>فراخوانی مجدد</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Patient / Local Self Camera Preview (PIP) */}
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 w-24 h-32 sm:w-44 sm:h-56 bg-slate-900 rounded-2xl border-2 border-teal-500/80 shadow-2xl overflow-hidden z-20">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${!isVideoOff ? 'block' : 'hidden'}`}
            />

            {isVideoOff && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 text-[10px] sm:text-xs p-1 sm:p-2 text-center">
                <VideoOff className="w-5 h-5 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-slate-500" />
                <span>دوربین غیرفعال</span>
              </div>
            )}

            <span className="absolute bottom-1.5 left-1.5 bg-slate-950/80 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md font-medium truncate max-w-[80%]">
              شما ({currentUser.name})
            </span>
          </div>

          {/* Side Overlay Chat during video call */}
          {showSideChat && (
            <div className="absolute top-0 left-0 bottom-0 w-80 bg-slate-900/95 border-r border-slate-800 backdrop-blur-md z-30 flex flex-col p-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-white text-xs font-bold">چت زنده در حین تماس</h4>
                <button
                  onClick={() => setShowSideChat(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  بستن
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 py-3 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-2xl max-w-[85%] ${
                      m.senderId === currentUser.id
                        ? 'bg-teal-600 text-white mr-auto'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    <span className="block text-[10px] opacity-75 font-semibold">{m.senderName}</span>
                    <p className="mt-0.5">{m.text}</p>
                    <span className="block text-[9px] opacity-60 text-left mt-1">{m.timestamp}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="پیام شما..."
                  className="flex-1 bg-slate-800 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-xl cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Call Controls Bar */}
        <div className="bg-slate-900 border-t border-slate-800 p-2.5 sm:p-4 flex items-center justify-center gap-2 sm:gap-4 z-10">
          <button
            onClick={toggleMute}
            className={`p-2.5 sm:p-3.5 rounded-2xl transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
            title={isMuted ? 'وصل کردن میکروفون' : 'قطع میکروفون'}
          >
            {isMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-2.5 sm:p-3.5 rounded-2xl transition-all cursor-pointer ${
              isVideoOff
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
            title={isVideoOff ? 'روشن کردن دوربین' : 'خاموش کردن دوربین'}
          >
            {isVideoOff ? <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Video className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <button
            onClick={() => setShowSideChat(!showSideChat)}
            className={`p-2.5 sm:p-3.5 rounded-2xl transition-all cursor-pointer relative ${
              showSideChat
                ? 'bg-teal-600 text-white'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
            title="چت متنی"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onClose}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>پایان مشاوره</span>
          </button>
        </div>
      </div>
    </div>
  );
};
