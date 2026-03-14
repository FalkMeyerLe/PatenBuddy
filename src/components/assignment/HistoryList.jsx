import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar, ChevronRight, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryList({ sessions, onSelect, onDelete, selectedId }) {
    if (!sessions || sessions.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Noch keine Zuordnungen erstellt</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {sessions.map((session, idx) => (
                <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                >
                    <Card
                        className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-all ${
                            selectedId === session.id
                                ? "border-slate-800 bg-slate-50 shadow-sm"
                                : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => onSelect(session)}
                    >
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{session.session_name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {session.session_date
                                    ? format(new Date(session.session_date), "d. MMMM yyyy", { locale: de })
                                    : format(new Date(session.created_date), "d. MMMM yyyy", { locale: de })}
                            </p>
                        </div>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                            {session.assignments?.length || 0} Zuordnungen
                        </Badge>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(session.id);
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}