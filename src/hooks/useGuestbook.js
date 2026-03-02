import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore"

export function useGuestbook() {
    const [messages, setMessages] = useState([])

    // 방명록 데이터 불러오기 로직
    useEffect(() => {
        const q = query(collection(db, "guestbook"), orderBy("id", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgData = snapshot.docs.map(doc => ({
                ...doc.data(),
                docId: doc.id
            }));
            const visibleMessages = msgData.filter(msg => msg.isDeleted !== true);
            setMessages(visibleMessages);
        });
        return () => unsubscribe();
    }, []);

    // 메시지 추가 함수
    const addMessage = async (newName, newText, newPassword) => {
        if (isNaN(newPassword)) {
            alert("비밀번호는 숫자만 입력 가능합니다.");
            return;
        }
        const now = new Date()
        const date = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`
        try {
            await addDoc(collection(db, "guestbook"), {
                id: Date.now(), name: newName, text: newText, password: newPassword, date: date, isDeleted: false
            });
        } catch (e) { console.error("Error adding: ", e); }
    }

    // 메시지 수정 함수
    const editMessage = async (docId, originalPassword, currentText) => {
        const inputPassword = prompt("비밀번호를 입력하세요");
        if (inputPassword === String(originalPassword)) {
            const newText = prompt("수정할 내용을 입력하세요", currentText);
            if (newText && newText !== currentText) {
                try {
                    await updateDoc(doc(db, "guestbook", docId), { text: newText, inputPassword: inputPassword });
                    alert("수정되었습니다.");
                } catch (e) { alert("수정 권한이 없습니다."); }
            }
        } else if (inputPassword !== null) { alert("비밀번호가 일치하지 않습니다."); }
    }

    // 메시지 삭제 함수
    const deleteMessage = async (docId, originalPassword) => {
        const inputPassword = prompt("비밀번호를 입력하세요.");
        if (inputPassword) {
            try {
                await updateDoc(doc(db, "guestbook", docId), { isDeleted: true, inputPassword: inputPassword });
                alert("삭제되었습니다.");
            } catch (e) { alert("비밀번호가 일치하지 않습니다."); }
        }
    }

    return { messages, addMessage, editMessage, deleteMessage };
}