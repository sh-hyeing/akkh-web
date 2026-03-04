import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Rose from './Rose';
import Bud from './Bud';

export default function Letter({ isOpen, messages, onAddMessage, onDeleteMessage, onEditMessage }) {
    const [currentMenu, setCurrentMenu] = useState('main');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [text, setText] = useState('');
    const [selectedImg, setSelectedImg] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4;

    const indexOfLastMessage = currentPage * postsPerPage;
    const indexOfFirstMessage = indexOfLastMessage - postsPerPage;
    const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
    const totalPages = Math.ceil(messages.length / postsPerPage);

    const samples = [
        { id: 1, src: 'https://static.wikia.nocookie.net/projectsekai/images/f/f7/Unyielding_Resolve_T.png/revision/latest/scale-to-width-down/1000?cb=20240109064604', title: '1' },
        { id: 2, src: 'https://static.wikia.nocookie.net/projectsekai/images/f/f5/Into_An_Exciting_Future_T.png/revision/latest/scale-to-width-down/1000?cb=20240109064457', title: '2' },
        { id: 3, src: 'https://static.wikia.nocookie.net/projectsekai/images/4/4b/White-Hot_Snowball_Fight%21_T.png/revision/latest/scale-to-width-down/1000?cb=20241221111417', title: '3' },
        { id: 4, src: 'https://static.wikia.nocookie.net/projectsekai/images/5/55/Can%27t_Wait_For_The_Show_T.png/revision/latest/scale-to-width-down/1000?cb=20241221030148', title: '4' },
    ];

    const handleAddSubmit = (e) => {
        if (e) e.stopPropagation();
        if (!name.trim() || !text.trim() || !password.trim()) return;
        onAddMessage(name, text, password);
        setName('');
        setText('');
        setPassword('');
    };

    return (
        <>
            <div
                className={`letter-container ${isOpen ? 'is-open' : 'is-closed'}`}
                style={{
                    position: 'absolute',

                    '--letter-transform': isOpen ? 'translate3d(0, -115px, 0) scale(1.04)' : 'translate3d(0, 65px, 0) scale(0.88)',

                    zIndex: isOpen ? 100 : 5,
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease-out, width 0.3s, height 0.3s, left 0.3s, top 0.3s', // 크기 변화 애니메이션 추가
                    background: '#ffffff',
                    display: 'flex', flexDirection: 'column',
                    padding: '24px 28px',
                    border: '1px solid rgba(200,178,148,0.5)',
                    boxShadow: '0 0px 25px rgba(72, 66, 72, 0.6)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                    <Bud size={12} opacity={0.55} /><Rose size={18} opacity={0.65} /><Bud size={14} opacity={0.6} /><Rose size={22} opacity={0.72} /><Bud size={14} opacity={0.6} /><Rose size={18} opacity={0.65} /><Bud size={12} opacity={0.55} />
                </div>

                <div className="flex justify-between items-center mb-2 pb-1">
                    <span style={{ color: '#b09070', fontSize: '10px', fontWeight: 'bold', letterSpacing: '4px' }}>AKKH</span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><span style={{ fontSize: '14px', opacity: 0.6 }}>✉</span></div>
                </div>

                <div className="flex gap-5 mb-2" style={{ fontSize: '10.5px', fontWeight: 'bold', letterSpacing: '1px' }}>
                    {['main', 'notice', 'sample', 'guest'].map(menu => (
                        <button key={menu} onClick={e => { e.stopPropagation(); setCurrentMenu(menu); }} style={{ cursor: 'pointer', background: 'none', border: 'none', color: currentMenu === menu ? '#8c7260' : '#c8bfb0', borderBottom: currentMenu === menu ? '1.5px solid #c09070' : '1.5px solid transparent', paddingBottom: '3px', transition: 'all 0.2s' }}>{menu.toUpperCase()}</button>
                    ))}
                </div>

                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {currentMenu === 'main' && (
                        <div style={{ textAlign: 'center', paddingTop: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}><Rose size={26} opacity={0.58} rotate={-15} /><Rose size={32} opacity={0.72} /><Rose size={26} opacity={0.58} rotate={15} /></div>
                            <h2 style={{ fontSize: '17px', color: '#7a6858', fontStyle: 'italic', marginBottom: '12px', fontWeight: 'normal' }}>Dear Guest</h2>
                            <p style={{ fontSize: '13px', color: '#857666', lineHeight: '1.8', fontWeight: 400 }}>Example..<br /></p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '14px' }}>{[0, 1, 2, 3, 4].map(i => <Bud key={i} size={11} opacity={0.45} />)}</div>
                        </div>
                    )}

                    {currentMenu === 'notice' && (
                        <div style={{ height: '100%', overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div><h3 style={{ fontSize: '14px', color: '#9e7b5a', marginBottom: '8px', fontWeight: 'bold' }}>소개</h3><div style={{ background: 'rgba(240,228,210,0.28)', border: '1px solid rgba(200,178,148,0.28)', padding: '12px', fontSize: '12.5px', lineHeight: '1.6', color: '#6b5e50' }}>example</div></div>
                            <div><h3 style={{ fontSize: '14px', color: '#9e7b5a', marginBottom: '8px', fontWeight: 'bold' }}>연락처</h3><div style={{ background: 'rgba(240,228,210,0.28)', border: '1px solid rgba(200,178,148,0.28)', padding: '12px', fontSize: '12.5px', lineHeight: '1.6', color: '#6b5e50' }}>• Email: example@email.com<br />• Twitter(X): @example</div></div>
                        </div>
                    )}

                    {currentMenu === 'sample' && (
                        <div style={{ height: '100%', overflowY: 'auto', padding: '10px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {samples.map(item => (
                                    <div key={item.id} onClick={() => setSelectedImg(item.src)} style={{ cursor: 'pointer', padding: '8px', background: '#fff', border: '2px solid #f0e8dc', outline: '4px dashed #fff', outlineOffset: '-10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}><img src={item.src} alt={item.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} /><p style={{ fontSize: '10px', textAlign: 'center', marginTop: '8px', color: '#9e7b5a' }}>{item.title}</p></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentMenu === 'guest' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

                            {/* 1. 메시지 리스트 영역  */}
                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                                {messages.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#a89f91', fontSize: '13px', marginTop: '40px', fontStyle: 'italic' }}>
                                        아직 메시지가 없습니다.
                                    </p>
                                ) : (
                                    currentMessages.map(msg => (
                                        <div key={msg.id} style={{ fontSize: '12.5px', borderBottom: '1px solid #f0e8dc', padding: '10px 0', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                            <Bud size={12} opacity={0.55} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <b style={{ color: '#9e7b5a' }}>{msg.name}</b>
                                                        <span style={{ color: '#c4bcae', fontSize: '11px' }}>{msg.date}</span>

                                                    </div>
                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                        <button onClick={(e) => { e.stopPropagation(); onEditMessage(msg.docId, msg.password, msg.text); }} style={{ background: 'none', border: 'none', color: '#c4bcae', cursor: 'pointer', fontSize: '10px' }}>수정</button>
                                                        <button onClick={(e) => { e.stopPropagation(); onDeleteMessage(msg.docId, msg.password); }} style={{ background: 'none', border: 'none', color: '#c4bcae', cursor: 'pointer', fontSize: '10px' }}>삭제</button>
                                                    </div>
                                                </div>
                                                <p style={{ margin: '4px 0 0', color: '#6b5e50', lineHeight: '1.6' }}>{msg.text}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* 2. 페이지 번호 영역 */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '15px 0 10px 0' }}>
                                {messages.length > postsPerPage && Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                    <button
                                        key={pageNum}
                                        onClick={(e) => { e.stopPropagation(); setCurrentPage(pageNum); }}
                                        style={{
                                            cursor: 'pointer', background: 'none', border: 'none', fontSize: '11px',
                                            color: currentPage === pageNum ? '#8c7260' : '#c8bfb0',
                                            fontWeight: currentPage === pageNum ? 'bold' : 'normal',
                                            textDecoration: currentPage === pageNum ? 'underline' : 'none'
                                        }}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>

                            {/* 3. 입력 폼 영역 (최하단 고정) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 12px', background: 'rgba(240,228,210,0.28)', border: '1px solid rgba(200,178,148,0.28)', borderRadius: '2px' }}>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid #d4bfa0', fontSize: '12px', outline: 'none', padding: '4px 2px', color: '#4a3f33' }} />
                                    <input type="password" inputMode="numeric" value={password} onChange={e => setPassword(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Password" style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid #d4bfa0', fontSize: '12px', outline: 'none', padding: '4px 2px', color: '#4a3f33' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <input value={text} onChange={e => setText(e.target.value)} placeholder="Message..." onKeyDown={e => e.key === 'Enter' && handleAddSubmit()} style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid #d4bfa0', fontSize: '12px', outline: 'none', padding: '4px 2px', color: '#4a3f33' }} />
                                    <button onClick={handleAddSubmit} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: 0.6 }}>🖋️</button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>

            {selectedImg && createPortal(
                <div onClick={() => setSelectedImg(null)} style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.6)', cursor: 'zoom-out', WebkitTransform: 'translate3d(0, 0, 0)', isolation: 'isolate' }}>
                    <img src={selectedImg} style={{ maxWidth: '90%', maxHeight: '80%', WebkitTransform: 'translate3d(0, 0, 0)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
                </div>,
                document.body
            )}
        </>
    );
}