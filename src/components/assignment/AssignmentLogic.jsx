/**
 * Erzeugt eine zufällige Derangement (Permutation ohne Fixpunkte) eines Arrays.
 * Jedes Element wird einem anderen zugeordnet, niemand sich selbst.
 */
function generateDerangement(arr) {
    const n = arr.length;
    if (n < 2) return null;

    for (let attempt = 0; attempt < 1000; attempt++) {
        const shuffled = [...arr];
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        // Check: no element at its original position
        const isDerangement = shuffled.every((item, idx) => item !== arr[idx]);
        if (isDerangement) return shuffled;
    }
    return null;
}

/**
 * Verteilt Jugendspieler gleichmäßig auf Senioren (max 2 pro Senior).
 */
function assignYouthToSeniors(youthPlayers, seniorPlayers) {
    const shuffledYouth = [...youthPlayers];
    for (let i = shuffledYouth.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledYouth[i], shuffledYouth[j]] = [shuffledYouth[j], shuffledYouth[i]];
    }

    const assignments = [];
    const seniorLoad = new Map();
    seniorPlayers.forEach(s => seniorLoad.set(s.name, 0));

    for (const youth of shuffledYouth) {
        // Find senior with least assignments, max 2
        let bestSenior = null;
        let bestLoad = Infinity;

        // Shuffle seniors to randomize among equal loads
        const shuffledSeniors = [...seniorPlayers];
        for (let i = shuffledSeniors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSeniors[i], shuffledSeniors[j]] = [shuffledSeniors[j], shuffledSeniors[i]];
        }

        for (const senior of shuffledSeniors) {
            const load = seniorLoad.get(senior.name);
            if (load < 2 && load < bestLoad) {
                bestSenior = senior;
                bestLoad = load;
            }
        }

        if (bestSenior) {
            assignments.push({
                godparent_name: bestSenior.name,
                godchild_name: youth.name,
                godchild_is_youth: true,
            });
            seniorLoad.set(bestSenior.name, seniorLoad.get(bestSenior.name) + 1);
        }
    }

    return assignments;
}

/**
 * Hauptfunktion: Erzeugt die komplette Zuordnung.
 * Runde 1: Senioren untereinander (Derangement)
 * Runde 2: Jugendspieler auf Senioren
 */
export function generateAssignments(players) {
    const presentSeniors = players.filter(p => p.is_present && !p.is_youth_player);
    const presentYouth = players.filter(p => p.is_present && p.is_youth_player);

    if (presentSeniors.length < 2) {
        return { error: "Es müssen mindestens 2 anwesende Nicht-Jugendspieler vorhanden sein." };
    }

    const maxYouthCapacity = presentSeniors.length * 2;
    if (presentYouth.length > maxYouthCapacity) {
        return { error: `Zu viele Jugendspieler (${presentYouth.length}) für ${presentSeniors.length} Senioren (max. ${maxYouthCapacity}).` };
    }

    // Runde 1: Senior-Derangement
    const seniorNames = presentSeniors.map(s => s.name);
    const deranged = generateDerangement(seniorNames);

    if (!deranged) {
        return { error: "Konnte keine gültige Zuordnung erzeugen. Bitte erneut versuchen." };
    }

    const seniorAssignments = seniorNames.map((name, idx) => ({
        godparent_name: name,
        godchild_name: deranged[idx],
        godchild_is_youth: false,
    }));

    // Runde 2: Jugendspieler auf Senioren
    const youthAssignments = assignYouthToSeniors(presentYouth, presentSeniors);

    return {
        assignments: [...seniorAssignments, ...youthAssignments],
        stats: {
            seniorCount: presentSeniors.length,
            youthCount: presentYouth.length,
            totalAssignments: seniorAssignments.length + youthAssignments.length,
        }
    };
}