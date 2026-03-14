const readCollection = (key) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const writeCollection = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const createId = () => crypto.randomUUID();

export const localDb = {
    players: {
        list() {
            return readCollection("players").sort((a, b) => a.name.localeCompare(b.name));
        },
        create(data) {
            const items = readCollection("players");
            const newItem = {
                id: createId(),
                ...data,
                created_date: new Date().toISOString(),
            };
            items.push(newItem);
            writeCollection("players", items);
            return newItem;
        },
        update(id, data) {
            const items = readCollection("players");
            const updated = items.map((item) =>
                item.id === id ? { ...item, ...data } : item
            );
            writeCollection("players", updated);
            return updated.find((item) => item.id === id);
        },
        delete(id) {
            const items = readCollection("players");
            const filtered = items.filter((item) => item.id !== id);
            writeCollection("players", filtered);
            return true;
        },
    },

    assignments: {
        list() {
            return readCollection("assignments").sort(
                (a, b) => new Date(b.created_date) - new Date(a.created_date)
            );
        },
        create(data) {
            const items = readCollection("assignments");
            const newItem = {
                id: createId(),
                ...data,
                created_date: new Date().toISOString(),
            };
            items.push(newItem);
            writeCollection("assignments", items);
            return newItem;
        },
        delete(id) {
            const items = readCollection("assignments");
            const filtered = items.filter((item) => item.id !== id);
            writeCollection("assignments", filtered);
            return true;
        },
    },
};