
import React, { useState } from 'react';

export const SocialClubScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'FEED' | 'LEADERBOARD'>('FEED');

  return (
    <div className="flex flex-col min-h-full bg-background-light dark:bg-background-dark font-display pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 flex flex-col bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4 pb-2">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">Social Club</h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20" aria-label="420 membres actifs">
                <span className="material-symbols-outlined text-secondary text-sm filled" aria-hidden="true">local_fire_department</span>
                <span className="text-xs font-bold text-secondary">420 membres</span>
            </div>
        </div>
        
        {/* Tabs */}
        <div className="flex px-4 gap-6" role="tablist">
            <TabButton label="Fil d'actu" active={activeTab === 'FEED'} onClick={() => setActiveTab('FEED')} />
            <TabButton label="Classement" active={activeTab === 'LEADERBOARD'} onClick={() => setActiveTab('LEADERBOARD')} />
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 flex flex-col gap-6">
        
        {/* Challenge Banner */}
        <div 
            className="relative rounded-2xl overflow-hidden h-32 shadow-lg group active:scale-[0.98] transition-transform"
            role="banner"
            aria-label="Challenge Hebdo: 7 Jours Sans Sucre"
        >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2940&auto=format&fit=crop")'}}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent"></div>
            <div className="absolute inset-0 p-4 flex flex-col justify-center text-white">
                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md w-fit text-[10px] font-bold uppercase tracking-widest mb-1">Challenge Hebdo</span>
                <h2 className="text-xl font-bold leading-tight">7 Jours Sans Sucre</h2>
                <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs font-medium opacity-90">+120 participants</span>
                    <div className="flex -space-x-2 overflow-hidden ml-2">
                        <img className="inline-block h-5 w-5 rounded-full ring-2 ring-primary" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" alt=""/>
                        <img className="inline-block h-5 w-5 rounded-full ring-2 ring-primary" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100" alt=""/>
                    </div>
                </div>
            </div>
        </div>

        {activeTab === 'FEED' ? (
            <div className="flex flex-col gap-6">
                <PostCard 
                    userImg="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
                    userName="Sophie L."
                    time="Il y a 2h"
                    postImg="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop"
                    caption="Poke Bowl maison après le leg day ! 🥗💪 #NattyFuel"
                    likes={24}
                    comments={3}
                />
                <PostCard 
                    userImg="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150"
                    userName="Marc D."
                    time="Il y a 5h"
                    postImg="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop"
                    caption="Nouveau PR au développé couché : 100kg ! 🔥 Merci au coach Sarah."
                    likes={56}
                    comments={12}
                />
            </div>
        ) : (
            <div className="flex flex-col gap-4">
                {/* Podium */}
                <div className="flex items-end justify-center gap-4 mb-4 pt-4">
                    <PodiumItem rank={2} name="Sophie" points={1250} img="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150" />
                    <PodiumItem rank={1} name="Marc" points={1540} img="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150" isFirst />
                    <PodiumItem rank={3} name="Thomas" points={1100} img="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150" />
                </div>
                
                {/* List */}
                <div className="flex flex-col gap-2">
                    <RankRow rank={4} name="Julie M." points={980} img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150" />
                    <RankRow rank={5} name="Alex Johnson" points={950} img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150" isMe />
                    <RankRow rank={6} name="David B." points={820} img="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150" />
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

const TabButton: React.FC<{label: string; active: boolean; onClick: () => void}> = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        role="tab"
        aria-selected={active}
        className={`pb-3 text-sm font-bold relative transition-colors ${active ? 'text-text-light dark:text-text-dark' : 'text-gray-400'}`}
    >
        {label}
        {active && <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-secondary"></div>}
    </button>
);

const PostCard: React.FC<{userImg: string; userName: string; time: string; postImg: string; caption: string; likes: number; comments: number}> = ({ userImg, userName, time, postImg, caption, likes, comments }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [currentLikes, setCurrentLikes] = useState(likes);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isReposted, setIsReposted] = useState(false);

    const handleLike = () => {
        if (isLiked) {
            setCurrentLikes(prev => prev - 1);
        } else {
            setCurrentLikes(prev => prev + 1);
        }
        setIsLiked(!isLiked);
    };

    return (
        <div className="bg-white dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-3 flex items-center gap-3">
                <img src={userImg} alt={userName} className="size-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700" />
                <div>
                    <p className="text-sm font-bold text-text-light dark:text-text-dark">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
                </div>
                <button className="ml-auto p-1 text-gray-400" aria-label="Plus d'options"><span className="material-symbols-outlined" aria-hidden="true">more_horiz</span></button>
            </div>
            <div className="relative group" onDoubleClick={handleLike} role="button" aria-label="Double cliquer pour aimer">
                <img src={postImg} alt="Post" className="w-full aspect-square object-cover" />
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-5">
                        <button 
                            onClick={handleLike}
                            aria-label={isLiked ? "Je n'aime plus" : "J'aime"}
                            className={`flex items-center gap-1.5 transition-colors active:scale-90 ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                            <span className={`material-symbols-outlined ${isLiked ? 'filled' : ''}`} aria-hidden="true">favorite</span>
                            <span className="text-sm font-bold">{currentLikes}</span>
                        </button>
                        <button aria-label="Commenter" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 active:scale-90 transition-transform">
                            <span className="material-symbols-outlined" aria-hidden="true">chat_bubble</span>
                            <span className="text-sm font-bold">{comments}</span>
                        </button>
                        <button 
                            onClick={() => setIsReposted(!isReposted)}
                            aria-label="Republier"
                            className={`flex items-center gap-1.5 transition-colors active:scale-90 ${isReposted ? 'text-green-500' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                            <span className="material-symbols-outlined" aria-hidden="true">repeat</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-5">
                        <button 
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            aria-label="Sauvegarder"
                            className={`transition-colors active:scale-90 ${isBookmarked ? 'text-warning' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                            <span className={`material-symbols-outlined ${isBookmarked ? 'filled' : ''}`} aria-hidden="true">bookmark</span>
                        </button>
                         <button aria-label="Partager" className="text-gray-400 hover:text-text-light dark:hover:text-white transition-colors active:scale-90">
                            <span className="material-symbols-outlined" aria-hidden="true">share</span>
                        </button>
                    </div>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">
                    <span className="font-bold mr-1">{userName}</span>
                    {caption}
                </p>
            </div>
        </div>
    );
};

const PodiumItem: React.FC<{rank: number; name: string; points: number; img: string; isFirst?: boolean}> = ({ rank, name, points, img, isFirst }) => (
    <div className={`flex flex-col items-center ${isFirst ? '-mt-6' : ''}`}>
        <div className={`relative rounded-full p-1 ${isFirst ? 'bg-gradient-to-b from-yellow-300 to-yellow-600' : rank === 2 ? 'bg-gray-300' : 'bg-orange-300'}`}>
            <img src={img} alt={name} className={`rounded-full object-cover border-2 border-background-light dark:border-background-dark ${isFirst ? 'size-20' : 'size-14'}`} />
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 size-6 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-background-light dark:border-background-dark ${isFirst ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                {rank}
            </div>
        </div>
        <p className="font-bold text-text-light dark:text-text-dark mt-3">{name}</p>
        <p className="text-xs font-medium text-secondary">{points} pts</p>
    </div>
);

const RankRow: React.FC<{rank: number; name: string; points: number; img: string; isMe?: boolean}> = ({ rank, name, points, img, isMe }) => (
    <div className={`flex items-center gap-4 p-3 rounded-xl ${isMe ? 'bg-primary/10 border border-primary/20' : 'bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800'}`}>
        <span className="font-bold text-gray-400 w-6 text-center">{rank}</span>
        <img src={img} alt={name} className="size-10 rounded-full object-cover" />
        <p className={`flex-1 text-sm font-bold ${isMe ? 'text-primary' : 'text-text-light dark:text-text-dark'}`}>{name}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{points} pts</p>
    </div>
);
