'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

/* ─── Instagram Gradient SVG defs ─── */
const IG_GRADIENT_ID = 'ig-story-gradient';
const IGGradientDef = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <linearGradient id={IG_GRADIENT_ID} x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#feda75" />
        <stop offset="25%" stopColor="#fa7e1e" />
        <stop offset="50%" stopColor="#d62976" />
        <stop offset="75%" stopColor="#962fbf" />
        <stop offset="100%" stopColor="#4f5bd5" />
      </linearGradient>
    </defs>
  </svg>
);

/* ─── Types ─── */
interface Story {
  id: number;
  name: string;
  isSelf?: boolean;
  hue: number;
}

interface PostData {
  id: number;
  user: string;
  hue: number;
  postHue: number;
  likes: number;
  caption: string;
  liked: boolean;
  saved: boolean;
}

/* ─── Static seed data ─── */
const STORIES: Story[] = [
  { id: 0, name: 'Your Story', isSelf: true, hue: 200 },
  { id: 1, name: 'alex_ray', hue: 30 },
  { id: 2, name: 'sarah_k', hue: 140 },
  { id: 3, name: 'jay_p', hue: 270 },
  { id: 4, name: 'mia.ux', hue: 55 },
  { id: 5, name: 'dev_dan', hue: 190 },
  { id: 6, name: 'nina_m', hue: 320 },
  { id: 7, name: 'tomás', hue: 15 },
];

const SEED_POSTS: PostData[] = [
  { id: 1, user: 'alex_ray', hue: 30, postHue: 210, likes: 10547, caption: 'Golden hour vibes 🌅 #photography #travel', liked: true, saved: false },
  { id: 2, user: 'sarah_k', hue: 140, postHue: 160, likes: 4821, caption: 'Exploring new trails every weekend 🌿', liked: false, saved: true },
  { id: 3, user: 'mia.ux', hue: 55, postHue: 45, likes: 7300, caption: 'Design thinking is everything ✨', liked: false, saved: false },
];

/* ─── Avatar placeholder ─── */
const Avatar = ({ hue, size = 32, className = '' }: { hue: number; size?: number; className?: string }) => (
  <div
    className={`rounded-full flex-shrink-0 ${className}`}
    style={{
      width: size,
      height: size,
      background: `linear-gradient(135deg, hsl(${hue},60%,70%), hsl(${hue + 60},70%,55%))`,
    }}
  />
);

/* ─── Instagram-ring wrapper ─── */
const StoryRing = ({ children, size = 64, ringWidth = 2.5 }: { children: React.ReactNode; size?: number; ringWidth?: number }) => (
  <div
    style={{
      width: size + ringWidth * 2 + 4,
      height: size + ringWidth * 2 + 4,
      borderRadius: '50%',
      padding: ringWidth + 2,
      background: `linear-gradient(to top right, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)`,
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: '#fff',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  </div>
);

/* ─── SVG Icons ─── */
const HeartIcon = ({ filled = false, className = '' }: { filled?: boolean; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? '#ef4444' : 'none'} stroke={filled ? '#ef4444' : 'currentColor'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ShareIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const BookmarkIcon = ({ filled = false, className = '' }: { filled?: boolean; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const MoreVerticalIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
  </svg>
);

const HomeFilledIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PlusSquareIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const ReelIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" />
  </svg>
);

const UserOutlineIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const XIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ─── Story Viewer Modal ─── */
const StoryModal = ({ story, onClose }: { story: Story; onClose: () => void }) => {
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 3000;

  useEffect(() => {
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setTimeout(onClose, 150);
      }
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
      onClick={onClose}
    >
      {/* Progress bar */}
      <div className="absolute top-3 left-3 right-3 h-1 bg-white/30 rounded-full overflow-hidden z-10">
        <div
          className="h-full bg-white rounded-full transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Close */}
      <button className="absolute top-4 right-4 z-10 text-white" onClick={onClose}>
        <XIcon className="w-7 h-7" />
      </button>

      {/* Story content */}
      <div
        className="w-full h-full flex flex-col items-center justify-center"
        style={{ background: `linear-gradient(135deg, hsl(${story.hue},60%,25%), hsl(${story.hue + 60},70%,15%))` }}
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar hue={story.hue} size={80} className="mb-4 border-2 border-white" />
        <p className="text-white font-semibold text-lg">{story.name}</p>
        <p className="text-white/50 text-sm mt-1">Story content</p>
      </div>
    </div>
  );
};

/* ─── Options Bottom Sheet ─── */
const OptionsSheet = ({ onClose }: { onClose: () => void }) => {
  const opts = ['Report', 'Unfollow', 'Add to Favorites', 'Cancel'];
  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-[91] bg-white rounded-t-3xl pb-8 pt-2 shadow-2xl"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.25,1,0.5,1) forwards' }}
      >
        <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-3" />
        {opts.map((opt, i) => (
          <button
            key={opt}
            onClick={onClose}
            className={`w-full px-6 py-4 text-left font-medium border-b border-zinc-100 transition-colors active:bg-zinc-50 ${opt === 'Cancel' ? 'text-zinc-400' : opt === 'Report' ? 'text-red-500' : 'text-zinc-900'} ${i === opts.length - 1 ? 'border-none' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </>
  );
};

/* ─── Share Overlay ─── */
const ShareOverlay = ({ onClose }: { onClose: () => void }) => {
  const friends = ['alex_ray', 'sarah_k', 'jay_p', 'mia.ux', 'dev_dan'];
  const hues = [30, 140, 270, 55, 190];
  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-[91] bg-white rounded-t-3xl pb-8 pt-2 shadow-2xl max-h-[70vh] overflow-y-auto"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.25,1,0.5,1) forwards' }}
      >
        <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-4" />
        <h3 className="text-center font-semibold text-zinc-900 mb-4 px-6">Share to</h3>
        <div className="flex gap-4 px-6 overflow-x-auto pb-2 hide-scrollbar">
          {friends.map((f, i) => (
            <button key={f} onClick={onClose} className="flex flex-col items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform">
              <Avatar hue={hues[i]} size={52} />
              <span className="text-xs text-zinc-700 font-medium">{f}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 px-6">
          <button onClick={onClose} className="w-full bg-zinc-100 text-zinc-700 font-semibold py-3 rounded-2xl text-sm active:bg-zinc-200 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Floating heart pop ─── */
const FloatingHeart = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
      style={{ animation: 'heartPop 0.8s cubic-bezier(0.25,1,0.5,1) forwards' }}
    >
      <svg viewBox="0 0 24 24" fill="#ef4444" style={{ width: 90, height: 90, filter: 'drop-shadow(0 4px 12px rgba(239,68,68,0.5))' }}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </div>
  );
};

/* ─── Single Post ─── */
const Post = ({ post, onUpdate }: { post: PostData; onUpdate: (id: number, changes: Partial<PostData>) => void }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isLiked, setIsLiked] = useState(post.liked);
  const [isSaved, setIsSaved] = useState(post.saved);
  const [likes, setLikes] = useState(post.likes);
  const [likeAnim, setLikeAnim] = useState(false);
  const lastTap = useRef(0);

  const handleDoubleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      const now = Date.now();
      if (now - lastTap.current < 350) {
        triggerLike(true);
      }
      lastTap.current = now;
    } else {
      // Desktop double click handled via onDoubleClick
      triggerLike(true);
    }
  }, []);

  const triggerLike = (forceOn = false) => {
    const newLiked = forceOn ? true : !isLiked;
    if (forceOn && isLiked) { setShowHeart(true); return; }
    setIsLiked(newLiked);
    setLikes(prev => newLiked ? prev + 1 : prev - 1);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 350);
    if (newLiked) setShowHeart(true);
  };

  const handleLikeClick = () => triggerLike();

  const formatLikes = (n: number) => n.toLocaleString();

  return (
    <>
      {showOptions && <OptionsSheet onClose={() => setShowOptions(false)} />}
      {showShare && <ShareOverlay onClose={() => setShowShare(false)} />}

      <article className="bg-white border-b border-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <StoryRing size={32}>
              <Avatar hue={post.hue} size={32} />
            </StoryRing>
            <div>
              <p className="text-[13px] font-semibold text-zinc-900 leading-tight">{post.user}</p>
              <p className="text-[11px] text-zinc-400 leading-tight">Sponsored</p>
            </div>
          </div>
          <button
            className="p-1.5 rounded-full active:bg-zinc-100 transition-colors"
            onClick={() => setShowOptions(true)}
          >
            <MoreVerticalIcon className="w-5 h-5 text-zinc-800" />
          </button>
        </div>

        {/* Image area */}
        <div
          className="w-full relative cursor-pointer select-none overflow-hidden"
          style={{ aspectRatio: '1/1' }}
          onDoubleClick={handleDoubleTap}
          onTouchEnd={handleDoubleTap}
        >
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, hsl(${post.postHue},30%,82%) 0%, hsl(${post.postHue + 40},25%,88%) 50%, hsl(${post.postHue - 20},20%,78%) 100%)`,
            }}
          />
          {showHeart && <FloatingHeart onDone={() => setShowHeart(false)} />}
        </div>

        {/* Action bar */}
        <div className="px-3 pt-2 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <button
                onClick={handleLikeClick}
                className="transition-transform active:scale-90"
                style={{ transform: likeAnim ? 'scale(1.25)' : 'scale(1)', transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)' }}
              >
                <HeartIcon filled={isLiked} className="w-7 h-7" />
              </button>
              <button className="transition-transform active:scale-90">
                <CommentIcon className="w-[26px] h-[26px] text-zinc-800" />
              </button>
              <button className="transition-transform active:scale-90" onClick={() => setShowShare(true)}>
                <ShareIcon className="w-6 h-6 text-zinc-800" />
              </button>
            </div>
            <button
              onClick={() => setIsSaved(s => !s)}
              className="transition-transform active:scale-90"
            >
              <BookmarkIcon filled={isSaved} className="w-[26px] h-[26px] text-zinc-800" />
            </button>
          </div>

          {/* Likes count */}
          <p className="text-[13px] font-semibold text-zinc-900 mt-2 leading-tight">
            {formatLikes(likes)} likes
          </p>

          {/* Caption */}
          <p className="text-[13px] text-zinc-900 mt-0.5 leading-snug">
            <span className="font-semibold">{post.user}</span>{' '}
            <span className="text-zinc-700">{post.caption}</span>
          </p>

          {/* View comments */}
          <button className="text-[13px] text-zinc-400 mt-1 mb-2 block">
            View all comments
          </button>
        </div>
      </article>
    </>
  );
};

/* ─── Stories Bar ─── */
const StoriesBar = ({ onStoryClick }: { onStoryClick: (story: Story) => void }) => (
  <div className="bg-white border-b border-zinc-100 overflow-x-auto hide-scrollbar">
    <div className="flex gap-3 px-3 py-3" style={{ width: 'max-content' }}>
      {STORIES.map((story) => (
        <button
          key={story.id}
          onClick={() => {
            if (story.isSelf) {
              console.log('Open Camera / Add Story');
            } else {
              onStoryClick(story);
            }
          }}
          className="flex flex-col items-center gap-1 flex-shrink-0 active:scale-95 transition-transform"
          style={{ width: 64 }}
        >
          <div className="relative">
            {story.isSelf ? (
              /* Self story — no gradient ring */
              <div
                className="rounded-full border-2 border-zinc-200 flex items-center justify-center"
                style={{ width: 64, height: 64 }}
              >
                <Avatar hue={story.hue} size={60} />
                {/* Blue plus badge */}
                <div
                  className="absolute bottom-0 right-0 w-5 h-5 bg-[#0095f6] rounded-full border-[2px] border-white flex items-center justify-center"
                  style={{ bottom: 1, right: 1 }}
                >
                  <svg viewBox="0 0 24 24" fill="white" width={12} height={12}>
                    <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z" />
                  </svg>
                </div>
              </div>
            ) : (
              /* Friend story — gradient ring */
              <StoryRing size={60}>
                <Avatar hue={story.hue} size={60} />
              </StoryRing>
            )}
          </div>
          <span className="text-[11px] text-zinc-600 truncate w-full text-center leading-tight font-medium">
            {story.isSelf ? 'Your story' : story.name}
          </span>
        </button>
      ))}
    </div>
  </div>
);

/* ─── Bottom Nav ─── */
const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: HomeFilledIcon },
  { id: 'search', label: 'Search', icon: SearchIcon },
  { id: 'create', label: 'Create', icon: PlusSquareIcon },
  { id: 'reels', label: 'Reels', icon: ReelIcon },
  { id: 'profile', label: 'Profile', icon: UserOutlineIcon },
];

const BottomNav = ({ active, setActive }: { active: string; setActive: (id: string) => void }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-50 flex items-center justify-around px-2 h-[52px] safe-b">
    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => setActive(id)}
        className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all active:scale-90 ${active === id ? 'text-zinc-900' : 'text-zinc-400'}`}
        aria-label={label}
      >
        <Icon className={`transition-all duration-150 ${id === 'home' ? 'w-[27px] h-[27px]' : 'w-[26px] h-[26px]'} ${active === id ? 'opacity-100' : 'opacity-60'}`} />
        {id === 'profile' && active === id && (
          <div className="w-1 h-1 rounded-full bg-zinc-900 mt-0.5" />
        )}
      </button>
    ))}
  </nav>
);

/* ─── Main Page ─── */
export default function InstagramFeedPage() {
  const [posts, setPosts] = useState<PostData[]>(SEED_POSTS);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeNav, setActiveNav] = useState('home');

  const updatePost = (id: number, changes: Partial<PostData>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
  };

  return (
    <>
      <IGGradientDef />
      {activeStory && (
        <StoryModal story={activeStory} onClose={() => setActiveStory(null)} />
      )}

      {/* Outer wrapper — centers on desktop, full-width on mobile */}
      <div className="min-h-screen bg-zinc-100 flex justify-center">
        {/* Phone-like frame on desktop, full screen on mobile */}
        <div
          className="
            relative bg-white flex flex-col
            w-full
            md:w-[390px] md:min-h-screen md:shadow-2xl
            lg:w-[390px]
          "
        >
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto hide-scrollbar pb-[52px]">
            <StoriesBar onStoryClick={(s) => setActiveStory(s)} />
            {posts.map(post => (
              <Post key={post.id} post={post} onUpdate={updatePost} />
            ))}
            <div className="h-4" />
          </div>

          <BottomNav active={activeNav} setActive={setActiveNav} />
        </div>

        {/* Desktop sidebar decorations */}
        <div className="hidden lg:flex flex-col ml-16 pt-8 w-[280px] flex-shrink-0">
          {/* Suggestions panel */}
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <StoryRing size={48}>
                  <Avatar hue={200} size={48} />
                </StoryRing>
                <div>
                  <p className="text-[13px] font-semibold text-zinc-900">you</p>
                  <p className="text-[12px] text-zinc-400">Your profile</p>
                </div>
              </div>
              <button className="text-[12px] font-semibold text-[#0095f6]">Switch</button>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold text-zinc-500">Suggested for you</span>
              <button className="text-[12px] font-semibold text-zinc-900">See All</button>
            </div>

            {STORIES.filter(s => !s.isSelf).slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <Avatar hue={s.hue} size={34} className="border border-zinc-200" />
                  <div>
                    <p className="text-[12px] font-semibold text-zinc-900">{s.name}</p>
                    <p className="text-[11px] text-zinc-400">Suggested for you</p>
                  </div>
                </div>
                <button className="text-[11px] font-semibold text-[#0095f6]">Follow</button>
              </div>
            ))}

            <p className="text-[11px] text-zinc-300 mt-6 leading-loose">
              About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language · Meta Verified
            </p>
            <p className="text-[11px] text-zinc-300 mt-2">© 2026 Instagram from Meta</p>
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @keyframes heartPop {
          0%   { opacity: 0; transform: scale(0.5); }
          40%  { opacity: 1; transform: scale(1.15); }
          65%  { transform: scale(0.95); }
          80%  { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0; transform: scale(1.0); }
        }

        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .safe-b { padding-bottom: env(safe-area-inset-bottom); }
        }

        /* On md+, center the fixed bottom nav inside the phone frame */
        @media (min-width: 768px) {
          nav.fixed {
            left: 50%;
            transform: translateX(-50%);
            width: 390px;
          }
        }
      `}</style>
    </>
  );
}
