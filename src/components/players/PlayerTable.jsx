import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlayerTable({ players, onAdd, onUpdate, onDelete }) {
    const [newName, setNewName] = useState("");
    const [newIsYouth, setNewIsYouth] = useState(false);

    const handleAdd = () => {
        if (!newName.trim()) return;
        onAdd({ name: newName.trim(), is_youth_player: newIsYouth, is_present: true });
        setNewName("");
        setNewIsYouth(false);
    };

    const presentCount = players.filter(p => p.is_present).length;
    const youthCount = players.filter(p => p.is_present && p.is_youth_player).length;
    const seniorCount = players.filter(p => p.is_present && !p.is_youth_player).length;

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-slate-800">{players.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Gesamt</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-700">{presentCount}</p>
                    <p className="text-xs text-emerald-600 mt-1">Anwesend</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-amber-700">{youthCount}</p>
                    <p className="text-xs text-amber-600 mt-1">Jugend (anw.)</p>
                </div>
            </div>

            {/* Add form */}
            <div className="flex gap-2 items-center">
                <Input
                    placeholder="Spielername..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    className="flex-1 h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                />
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 cursor-pointer select-none whitespace-nowrap">
                    <Checkbox
                        checked={newIsYouth}
                        onCheckedChange={setNewIsYouth}
                        className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                    <span className="text-sm text-amber-800">Jugend</span>
                </label>
                <Button onClick={handleAdd} className="h-11 bg-slate-800 hover:bg-slate-700">
                    <Plus className="w-4 h-4 mr-1" /> Hinzufügen
                </Button>
            </div>

            {/* Player list */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 px-5 py-3 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Name</span>
                    <span className="text-center">Typ</span>
                    <span className="text-center">Anwesend</span>
                    <span></span>
                </div>
                <div className="divide-y divide-slate-100">
                    <AnimatePresence>
                        {players.map((player) => (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-[1fr,auto,auto,auto] gap-4 px-5 py-3.5 items-center hover:bg-slate-50/50 transition-colors"
                            >
                <span className={`font-medium ${player.is_present ? "text-slate-800" : "text-slate-400"}`}>
                  {player.name}
                </span>
                                <div className="flex justify-center">
                                    {player.is_youth_player ? (
                                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                                            Jugend
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100">
                                            Senior
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex justify-center">
                                    <Checkbox
                                        checked={player.is_present}
                                        onCheckedChange={(checked) => onUpdate(player.id, { is_present: checked })}
                                        className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(player.id)}
                                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {players.length === 0 && (
                        <div className="px-5 py-12 text-center text-slate-400">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Noch keine Spieler hinzugefügt</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}