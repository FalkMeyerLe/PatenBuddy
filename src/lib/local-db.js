import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

const playersCollection = collection(db, "players");
const assignmentsCollection = collection(db, "assignments");

const addCreatedDate = (data) => ({
    ...data,
    created_date: new Date().toISOString(),
});

const toEntity = (snapshot) => ({
    id: snapshot.id,
    ...snapshot.data(),
});

export const localDb = {
    players: {
        async list() {
            const snapshot = await getDocs(query(playersCollection, orderBy("name", "asc")));
            return snapshot.docs.map(toEntity);
        },
        async create(data) {
            const payload = addCreatedDate(data);
            const ref = await addDoc(playersCollection, payload);
            return { id: ref.id, ...payload };
        },
        async update(id, data) {
            await updateDoc(doc(db, "players", id), data);
            return { id, ...data };
        },
        async delete(id) {
            await deleteDoc(doc(db, "players", id));
            return true;
        },
    },

    assignments: {
        async list() {
            const snapshot = await getDocs(
                query(assignmentsCollection, orderBy("created_date", "desc"))
            );
            return snapshot.docs.map(toEntity);
        },
        async create(data) {
            const payload = addCreatedDate(data);
            const ref = await addDoc(assignmentsCollection, payload);
            return { id: ref.id, ...payload };
        },
        async delete(id) {
            await deleteDoc(doc(db, "assignments", id));
            return true;
        },
    },
};