import React, { useState } from "react";
import { localDb } from "@/lib/local-db";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shuffle, Save, AlertCircle, Users, History, Download, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { de } from "date-fns/locale";

import PlayerTable from "../components/players/PlayerTable";
import AssignmentResult from "../components/assignment/AssignmentResult";
import HistoryList from "../components/assignment/HistoryList";
import { generateAssignments } from "../components/assignment/AssignmentLogic";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const [activeTab, setActiveTab] = useState("players");
    const [currentResult, setCurrentResult] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionName, setSessionName] = useState("");
    const queryClient = useQueryClient();
    const { isOwner, user, login, logout, authError, loading } = useAuth();

    const { data: players = [] } = useQuery({
        queryKey: ["players"],
        queryFn: async () => localDb.players.list(),
    });

    const { data: sessions = [] } = useQuery({
        queryKey: ["assignments"],
        queryFn: async () => localDb.assignments.list(),
    });

    const addPlayer = useMutation({
        mutationFn: async (data) => localDb.players.create(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["players"] }),
    });

    const updatePlayer = useMutation({
        mutationFn: async ({ id, data }) => localDb.players.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["players"] }),
    });

    const deletePlayer = useMutation({
        mutationFn: async (id) => localDb.players.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["players"] }),
    });

    const saveSession = useMutation({
        mutationFn: async (data) => localDb.assignments.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            toast.success("Zuordnung gespeichert!");
        },
    });

    const deleteSession = useMutation({
        mutationFn: async (id) => localDb.assignments.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            if (selectedSession?.id === id) setSelectedSession(null);
        },
    });

    const handleGenerate = () => {
        const result = generateAssignments(players);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        setCurrentResult(result);
        setActiveTab("result");
        toast.success(`${result.stats.totalAssignments} Zuordnungen erstellt!`);
    };

    const handleSave = () => {
        if (!currentResult) return;
        const name = sessionName.trim() || format(new Date(), "'Zuordnung' d. MMM yyyy", { locale: de });
        saveSession.mutate({
            session_name: name,
            session_date: new Date().toISOString().split("T")[0],
            assignments: currentResult.assignments,
        });
        setSessionName("");
    };

    const handleExportCSV = (assignments) => {
        if (!assignments || assignments.length === 0) return;
        const header = "Pate,Patenkind,Typ\n";
        const rows = assignments
            .map(a => `${a.godparent_name},${a.godchild_name},${a.godchild_is_youth ? "Jugend" : "Senior"}`)
            .join("\n");
        const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "patenschaften.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    const presentSeniors = players.filter(p => p.is_present && !p.is_youth_player);
    const presentYouth = players.filter(p => p.is_present && p.is_youth_player);
    const canGenerate = isOwner && presentSeniors.length >= 2;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
                <div className="mb-10 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                            Patenschaft-Zuordnung
                        </h1>
                        <p className="text-slate-500 mt-2 text-base">
                            Zufällige Zuordnung von Patenkindern für anwesende Spieler
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        {!loading && (
                            isOwner ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500 hidden sm:block">{user.email}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={logout}
                                        className="h-9 gap-2 text-slate-600"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Abmelden
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={login}
                                    className="h-9 gap-2 text-slate-600"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Anmelden
                                </Button>
                            )
                        )}
                        {authError && (
                            <p className="text-xs text-red-600 max-w-[220px] text-right">{authError}</p>
                        )}
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-slate-100 mb-8 h-11">
                        <TabsTrigger value="players" className="gap-2 data-[state=active]:bg-white">
                            <Users className="w-4 h-4" /> Spieler
                        </TabsTrigger>
                        <TabsTrigger value="result" className="gap-2 data-[state=active]:bg-white" disabled={!currentResult && !selectedSession}>
                            <Shuffle className="w-4 h-4" /> Ergebnis
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-white">
                            <History className="w-4 h-4" /> Verlauf
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="players" className="space-y-6">
                        <PlayerTable
                            players={players}
                            readOnly={!isOwner}
                            onAdd={(data) => addPlayer.mutate(data)}
                            onUpdate={(id, data) => updatePlayer.mutate({ id, data })}
                            onDelete={(id) => deletePlayer.mutate(id)}
                        />

                        {isOwner && (
                            <div className="pt-4 border-t border-slate-200">
                                {!canGenerate && players.length > 0 && (
                                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-amber-800">
                                            <p className="font-medium">Mindestens 2 anwesende Nicht-Jugendspieler benötigt</p>
                                            <p className="mt-1 text-amber-600">
                                                Aktuell: {presentSeniors.length} Senioren, {presentYouth.length} Jugendspieler anwesend
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <Button
                                    onClick={handleGenerate}
                                    disabled={!canGenerate}
                                    size="lg"
                                    className="w-full h-14 bg-slate-800 hover:bg-slate-700 text-base font-semibold tracking-wide disabled:opacity-40"
                                >
                                    <Shuffle className="w-5 h-5 mr-2" />
                                    Zuordnung starten
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="result" className="space-y-6">
                        {(currentResult || selectedSession) && (
                            <>
                                <div className="flex gap-3 flex-wrap items-center">
                                    {isOwner && currentResult && (
                                        <>
                                            <Input
                                                placeholder="Name der Sitzung (optional)"
                                                value={sessionName}
                                                onChange={(e) => setSessionName(e.target.value)}
                                                className="flex-1 min-w-[200px] h-11 border-slate-200"
                                            />
                                            <Button onClick={handleSave} className="h-11 bg-emerald-600 hover:bg-emerald-700">
                                                <Save className="w-4 h-4 mr-2" /> Speichern
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={() => handleExportCSV(currentResult?.assignments || selectedSession?.assignments)}
                                        className="h-11"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> CSV Export
                                    </Button>
                                    {isOwner && currentResult && (
                                        <Button variant="outline" onClick={handleGenerate} className="h-11">
                                            <Shuffle className="w-4 h-4 mr-2" /> Neu mischen
                                        </Button>
                                    )}
                                </div>

                                <AssignmentResult
                                    assignments={currentResult?.assignments || selectedSession?.assignments}
                                    stats={
                                        currentResult?.stats || {
                                            seniorCount: (selectedSession?.assignments || []).filter(a => !a.godchild_is_youth).length,
                                            youthCount: (selectedSession?.assignments || []).filter(a => a.godchild_is_youth).length,
                                            totalAssignments: (selectedSession?.assignments || []).length,
                                        }
                                    }
                                />
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="history">
                        <HistoryList
                            sessions={sessions}
                            readOnly={!isOwner}
                            selectedId={selectedSession?.id}
                            onSelect={(session) => {
                                setSelectedSession(session);
                                setCurrentResult(null);
                                setActiveTab("result");
                            }}
                            onDelete={(id) => deleteSession.mutate(id)}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}