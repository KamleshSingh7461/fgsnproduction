'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MatchStateDTO } from '@fgsn/dtos';

export function useMatchListener(targetMatchId?: string) {
    const [match, setMatch] = useState<MatchStateDTO | null>(null);
    const lastDataRef = useRef<string>('');
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // If we are in a browser environment, get matchId from URL if not provided
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const matchId = targetMatchId || urlParams?.get('matchId') || 'match_001';

        const abortController = new AbortController();

        // 1. WebSocket Relay (Real-time Cross-Network)
        socketRef.current = io('http://localhost:3005');

        socketRef.current.emit('join-match', matchId);

        socketRef.current.on('match-updated', (data: MatchStateDTO) => {
            // Only update if it matches our ID (or if we are in a generic listener mode)
            // Ideally the server only sends updates for the room we joined
            const dataStr = JSON.stringify(data);
            if (dataStr !== lastDataRef.current) {
                lastDataRef.current = dataStr;
                setMatch(data);
            }
        });

        // 2. Local Bus (For same-port updates)
        const channel = new BroadcastChannel('fgsn_microservice_bus');
        channel.onmessage = (event) => {
            if (event.data?.type === 'MATCH_UPDATE') {
                // Filter by matchId if possible, effectively simplified here
                const payload = event.data.payload;
                // If the payload has an ID and it doesn't match, ignore (unless we want all)
                // For now, prompt assumes global or single-match context locally
                const newDataStr = JSON.stringify(payload);
                if (newDataStr !== lastDataRef.current) {
                    lastDataRef.current = newDataStr;
                    setMatch(payload);
                }
            }
        };

        // 3. Optimized Cross-Port Polling (Fallback)
        const fetchState = async () => {
            try {
                const res = await fetch(`/api/state?matchId=${matchId}`, { signal: abortController.signal });
                if (res.ok) {
                    const data = await res.json();
                    const dataStr = JSON.stringify(data);
                    if (dataStr !== lastDataRef.current) {
                        lastDataRef.current = dataStr;
                        setMatch(data);
                    }
                }
            } catch (e: any) {
                if (e.name !== 'AbortError') {
                    // console.error("Broadcast polling error", e);
                }
            }
        };

        fetchState();
        const interval = setInterval(fetchState, 1000);

        return () => {
            abortController.abort();
            channel.close();
            clearInterval(interval);
            socketRef.current?.disconnect();
        };
    }, [targetMatchId]);

    return match;
}
