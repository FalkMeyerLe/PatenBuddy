import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function AssignmentResult({ assignments, stats }) {
    if (!assignments || assignments.length === 0) return null;

    const seniorAssignments = assignments.filter(a => !a.godchild_is_youth);
    const youthAssignments = assignments.filter(a => a.godchild_is_youth);

    // Group youth by godparent
    const youthByGodparent = {};
    youthAssignments.forEach(a => {
        if (!youthByGodparent[a.godparent_name]) youthByGodparent[a.godparent_name] = [];
        youthByGodparent[a.godparent_name].push(a.godchild_name);
    });

    return (
        <div className="space-y-8">
            {/* Stats bar */}
            <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                    <Users className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">{stats.seniorCount} Senioren</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">{stats.youthCount} Jugendspieler</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full">
                    <span className="text-sm font-medium text-emerald-700">{stats.totalAssignments} Zuordnungen</span>
                </div>
            </div>

            {/* Runde 1: Senioren */}
            <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    Runde 1 — Senioren untereinander
                </h3>
                <div className="grid gap-2">
                    {seniorAssignments.map((a, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="flex items-center gap-3 px-5 py-3 border-slate-200 hover:border-slate-300 transition-colors">
                                <span className="font-semibold text-slate-800 min-w-[120px]">{a.godparent_name}</span>
                                <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span className="text-slate-600">{a.godchild_name}</span>
                                <Badge variant="secondary" className="ml-auto bg-slate-100 text-slate-500 text-xs">
                                    Senior
                                </Badge>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Runde 2: Jugendspieler */}
            {youthAssignments.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                        Runde 2 — Jugendspieler-Zuordnung
                    </h3>
                    <div className="grid gap-2">
                        {youthAssignments.map((a, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (seniorAssignments.length + idx) * 0.05 }}
                            >
                                <Card className="flex items-center gap-3 px-5 py-3 border-amber-200 bg-amber-50/30 hover:border-amber-300 transition-colors">
                                    <span className="font-semibold text-slate-800 min-w-[120px]">{a.godparent_name}</span>
                                    <ArrowRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                    <span className="text-amber-800">{a.godchild_name}</span>
                                    <Badge className="ml-auto bg-amber-100 text-amber-700 border-amber-200 text-xs">
                                        Jugend
                                    </Badge>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary per godparent */}
                    <div className="mt-6">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Übersicht pro Pate
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(youthByGodparent).map(([godparent, children]) => (
                                <div key={godparent} className="bg-slate-50 rounded-xl p-4">
                                    <p className="font-semibold text-slate-800 text-sm">{godparent}</p>
                                    <div className="mt-2 space-y-1">
                                        {children.map((child, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-amber-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                {child}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}