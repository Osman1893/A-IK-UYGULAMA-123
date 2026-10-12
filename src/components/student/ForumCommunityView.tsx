import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Bookmark, 
  Send, 
  Plus, 
  Search, 
  Sparkles, 
  Volume2, 
  Crown, 
  Tag, 
  Check, 
  Award, 
  Pin, 
  ChevronDown, 
  ChevronUp, 
  X, 
  User, 
  MessageCircle,
  HelpCircle,
  BookOpen,
  Feather,
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';
import { 
  UserProfile, 
  ForumPost, 
  ForumComment, 
  ForumCategory,
  CefrLevel 
} from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';

interface ForumCommunityViewProps {
  user: UserProfile;
  onOpenAuth?: () => void;
  onNavigateTab?: (tab: any) => void;
}

const CATEGORY_TABS: { key: ForumCategory; labelTr: string; labelKz: string; icon: string }[] = [
  { key: 'all', labelTr: 'Tümü', labelKz: 'Барлығы', icon: '📌' },
  { key: 'qa', labelTr: 'Soru & Cevap', labelKz: 'Сұрақ-Жауап', icon: '❓' },
  { key: 'grammar_tips', labelTr: 'Dil Bilgisi', labelKz: 'Грамматика', icon: '📖' },
  { key: 'linguistics', labelTr: 'Yalancı Eşdeğerlik', labelKz: 'Жалған Достар', icon: '⚠️' },
  { key: 'literature', labelTr: 'Hikaye & Edebiyat', labelKz: 'Әдебиет & Өлең', icon: '✍️' },
  { key: 'culture', labelTr: 'Kültür & Tanışma', labelKz: 'Мәдениет & Тілдесу', icon: '🤝' },
  { key: 'resources', labelTr: 'Kaynak & Kitap', labelKz: 'Кітап & Ресурс', icon: '📚' }
];

export const ForumCommunityView: React.FC<ForumCommunityViewProps> = ({
  user,
  onOpenAuth,
  onNavigateTab
}) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';

  // Posts State loaded from storageService
  const [posts, setPosts] = useState<ForumPost[]>(() => storageService.getForumPosts());
  
  // UI states
  const [activeCategory, setActiveCategory] = useState<ForumCategory>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'bookmarked'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Post Modal
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<ForumCategory>('qa');
  const [newTags, setNewTags] = useState('Kazakça, Soru');

  // Expanded Post ID for comments
  const [expandedPostIds, setExpandedPostIds] = useState<Set<string>>(new Set(['post-welcome-1', 'post-grammar-1']));
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  // Audio feedback toast / playing state
  const [playingTextId, setPlayingTextId] = useState<string | null>(null);

  // Toggle expansion of comments
  const toggleComments = (postId: string) => {
    setExpandedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  // Like a post
  const handleLikePost = (postId: string) => {
    const updated = storageService.togglePostLike(postId);
    if (updated) {
      setPosts(storageService.getForumPosts());
      audioService.playFeedbackSound('click');
    }
  };

  // Bookmark a post
  const handleBookmarkPost = (postId: string) => {
    storageService.toggleBookmarkPost(postId);
    setPosts(storageService.getForumPosts());
    audioService.playFeedbackSound('click');
  };

  // Add Comment
  const handleAddComment = (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    storageService.addPostComment(postId, {
      postId,
      authorId: user.id,
      authorName: user.name,
      authorNickname: user.nickname,
      authorAvatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      authorTitle: user.customTitle || (user.isSuperAdmin ? 'Baş Türkolog & Kurucu' : 'Genç Türkolog'),
      authorLevel: user.currentLevel,
      isSuperAdmin: user.isSuperAdmin,
      content: text
    });

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setPosts(storageService.getForumPosts());
    audioService.playFeedbackSound('complete');

    // Auto-expand post comments
    setExpandedPostIds(prev => new Set(prev).add(postId));
  };

  // Create New Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    storageService.createForumPost({
      authorId: user.id,
      authorName: user.name,
      authorNickname: user.nickname,
      authorAvatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      authorTitle: user.customTitle || (user.isSuperAdmin ? 'Baş Türkolog & Kurucu' : 'Genç Türkolog'),
      authorLevel: user.currentLevel,
      isSuperAdmin: user.isSuperAdmin,
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['Genel', 'DilPratiği'],
      pinned: false
    });

    setPosts(storageService.getForumPosts());
    setIsNewPostModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('Kazakça, Soru');
    audioService.playFeedbackSound('complete');
  };

  // Speak post or comment aloud
  const handleSpeakText = (id: string, text: string) => {
    setPlayingTextId(id);
    audioService.speak(text, 'kk');
    setTimeout(() => {
      setPlayingTextId(null);
    }, 3500);
  };

  // Filter and Sort Posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Category filter
      if (activeCategory !== 'all' && post.category !== activeCategory) {
        return false;
      }
      // Bookmark filter
      if (sortBy === 'bookmarked' && !post.isBookmarked) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesContent = post.content.toLowerCase().includes(q);
        const matchesAuthor = post.authorName.toLowerCase().includes(q) || (post.authorNickname && post.authorNickname.toLowerCase().includes(q));
        const matchesTags = post.tags.some(t => t.toLowerCase().includes(q));
        return matchesTitle || matchesContent || matchesAuthor || matchesTags;
      }
      return true;
    }).sort((a, b) => {
      // Pinned posts always on top
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      if (sortBy === 'popular') {
        return (b.likesCount + b.comments.length) - (a.likesCount + a.comments.length);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [posts, activeCategory, sortBy, searchQuery]);

  return (
    <div className="flex-1 flex flex-col pb-16 bg-slate-50/70">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-cyan-950 text-white px-5 pt-5 pb-6 rounded-b-3xl shadow-md">
        
        {/* Title and Top Action */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Forum
            </h1>
            <p className="text-[11px] text-teal-100 font-medium mt-0.5">
              Soru sor, dil bilgisi ipuçlarını paylaş ve pratik yap
            </p>
          </div>

          {/* New Post Button */}
          <button
            onClick={() => setIsNewPostModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Yeni Konu</span>
          </button>
        </div>

        {/* User Identity Chip */}
        <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-white/80"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">{user.name.split(' ')[0]}</span>
                {user.nickname ? (
                  <span className="text-[10px] font-bold text-teal-200 bg-teal-900/60 px-1.5 py-0.2 rounded">
                    @{user.nickname}
                  </span>
                ) : (
                  <span className="text-[9px] text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded">
                    Lakap belirlemediniz
                  </span>
                )}
                {user.isSuperAdmin && (
                  <Crown className="w-3 h-3 text-amber-400" />
                )}
              </div>
              <p className="text-[10px] text-teal-100 font-medium">
                {user.customTitle || 'Genç Türkolog'} • Seviye: {user.currentLevel}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('profile')}
            className="text-[10px] font-black text-white hover:text-amber-200 underline flex items-center gap-1"
          >
            <span>Profili Düzenle</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-teal-300 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTr ? "Konu, kelime, soru veya yazar ara..." : "Тақырыпты, сұрақты немесе авторды іздеу..."}
            className="w-full pl-9 pr-8 py-2 text-xs bg-white/15 border border-white/20 rounded-xl text-white placeholder-teal-200/70 focus:outline-hidden focus:bg-white/20 transition font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-teal-300 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Main Content Area */}
      <div className="px-4 py-3 space-y-3">
        
        {/* Category Horizontal Scroll Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs scale-102'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{isTr ? cat.labelTr : cat.labelKz}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-Filters: Popular vs Newest vs Bookmarked */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-slate-500">
            {filteredPosts.length} Konu listeleniyor
          </span>
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-[10px] font-bold text-slate-700">
            <button
              onClick={() => setSortBy('popular')}
              className={`px-2 py-0.5 rounded-md transition ${sortBy === 'popular' ? 'bg-white text-teal-900 shadow-2xs font-black' : ''}`}
            >
              Popüler
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-2 py-0.5 rounded-md transition ${sortBy === 'newest' ? 'bg-white text-teal-900 shadow-2xs font-black' : ''}`}
            >
              En Yeni
            </button>
            <button
              onClick={() => setSortBy('bookmarked')}
              className={`px-2 py-0.5 rounded-md transition ${sortBy === 'bookmarked' ? 'bg-white text-teal-900 shadow-2xs font-black' : ''}`}
            >
              Kaydedilenler
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-slate-800">Henüz Konu Bulunamadı</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Bu kategoride veya arama kriterinde henüz bir paylaşım yok. İlk konuyu siz açarak tartışmayı başlatın!
            </p>
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              İlk Konuyu Sen Başlat
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => {
              const isExpanded = expandedPostIds.has(post.id);
              const isAudioPlaying = playingTextId === post.id;

              return (
                <div
                  key={post.id}
                  className={`bg-white rounded-3xl border transition shadow-2xs overflow-hidden ${
                    post.pinned 
                      ? 'border-amber-300 ring-1 ring-amber-200' 
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Pinned Announcement Ribbon */}
                  {post.pinned && (
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                      <Pin className="w-3 h-3 fill-white" />
                      <span>SABİTLENMİŞ DUYURU & REHBER</span>
                    </div>
                  )}

                  <div className="p-4 space-y-2.5">
                    
                    {/* Author Meta Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.authorAvatarUrl}
                          alt={post.authorName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-teal-500/30"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900 leading-tight">
                              {post.authorName}
                            </span>
                            {post.isSuperAdmin && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded text-[9px] font-black flex items-center gap-0.5">
                                <Crown className="w-2.5 h-2.5 text-amber-600" />
                                <span>Admin</span>
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                            {post.authorNickname && (
                              <span className="font-bold text-teal-700 bg-teal-50 px-1 rounded">
                                @{post.authorNickname}
                              </span>
                            )}
                            <span className="font-semibold text-slate-600">
                              {post.authorTitle || 'Genç Türkolog'}
                            </span>
                            <span>•</span>
                            <span className="px-1 bg-slate-100 rounded text-[9px] font-black text-slate-700">
                              {post.authorLevel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={() => handleBookmarkPost(post.id)}
                        className={`p-1.5 rounded-xl transition ${
                          post.isBookmarked 
                            ? 'text-amber-500 bg-amber-50' 
                            : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                        }`}
                        title="Kaydet"
                      >
                        <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    {/* Post Title */}
                    <h3 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                      {post.title}
                    </h3>

                    {/* Post Content */}
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                      {post.content}
                    </p>

                    {/* Tags and Audio Pronounce Tool */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-md transition"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Read Out Loud (Kazakh speech engine) */}
                      <button
                        onClick={() => handleSpeakText(post.id, post.content.slice(0, 150))}
                        className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border transition ${
                          isAudioPlaying
                            ? 'bg-teal-600 text-white border-teal-600 animate-pulse'
                            : 'bg-slate-50 text-teal-700 border-teal-200 hover:bg-teal-50'
                        }`}
                        title="Kazakça sesli telaffuz dinle"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isAudioPlaying ? 'Okunuyor...' : 'Dinle'}</span>
                      </button>
                    </div>

                    {/* Actions Row: Likes, Comments Toggle */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        {/* Like Button */}
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition ${
                            post.likedByCurrentUser
                              ? 'bg-rose-50 text-rose-600 font-black'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${post.likedByCurrentUser ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>{post.likesCount}</span>
                        </button>

                        {/* Comments Toggle */}
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-slate-600 hover:bg-slate-50 font-bold transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.comments.length} Yorum</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                  </div>

                  {/* Expanded Comments Thread */}
                  {isExpanded && (
                    <div className="bg-slate-50/80 p-4 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                      
                      {/* Existing Comments */}
                      {post.comments.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic text-center py-2">
                          Henüz yorum yapılmadı. İlk düşünceni sen paylaş!
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-1.5 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={comment.authorAvatarUrl}
                                    alt={comment.authorName}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  <span className="text-xs font-bold text-slate-900">
                                    {comment.authorName}
                                  </span>
                                  {comment.authorNickname && (
                                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1 rounded">
                                      @{comment.authorNickname}
                                    </span>
                                  )}
                                  {comment.isSuperAdmin && (
                                    <Crown className="w-3 h-3 text-amber-500" />
                                  )}
                                </div>
                                <span className="text-[9px] text-slate-400">
                                  {new Date(comment.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>

                              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line pl-8">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Input Form */}
                      <div className="pt-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt={user.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-teal-500/50"
                          />
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                            placeholder={user.nickname ? `@${user.nickname} olarak yanıt yaz...` : "Yanıtınızı yazın..."}
                            className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800 font-medium"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!(commentInputs[post.id] || '').trim()}
                            className="p-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* NEW POST MODAL */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-teal-700 to-cyan-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black tracking-tight">Yeni Forum Konusu Aç</h3>
                <p className="text-[10px] text-teal-100 font-medium">
                  Kazakça sorularınızı, dil bilgisi deneyimlerinizi veya edebi metinlerinizi paylaşın
                </p>
              </div>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreatePost} className="p-5 space-y-3.5 overflow-y-auto">
              
              {/* Author Identity in Post */}
              <div className="p-2.5 bg-teal-50/70 rounded-2xl border border-teal-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {user.nickname && (
                        <span className="text-[10px] text-teal-700 font-bold bg-teal-100 px-1.5 py-0.2 rounded">
                          @{user.nickname}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {user.customTitle || 'Genç Türkolog'} ({user.currentLevel})
                    </span>
                  </div>
                </div>

                {!user.nickname && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Lakap ekleyebilirsiniz
                  </span>
                )}
              </div>

              {/* Category Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Kategori Seçin:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ForumCategory)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden font-medium bg-white text-slate-800"
                >
                  <option value="qa">❓ Soru & Cevap (Сұрақ-Жауап)</option>
                  <option value="grammar_tips">📖 Dil Bilgisi & İpuçları (Грамматика)</option>
                  <option value="linguistics">⚠️ Yalancı Eşdeğerlikler (Жалған Достар)</option>
                  <option value="literature">✍️ Hikaye, Şiir & Edebiyat (Әдебиет)</option>
                  <option value="culture">🤝 Kültür, Tanışma & Pratik (Мәдениет)</option>
                  <option value="resources">📚 Kaynak, Kitap & Dizi Tavsiyesi</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Konu Başlığı:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Kazakçada soru ekleri (-ма/-ме) nasıl seçilir?"
                  required
                  maxLength={100}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800 font-bold"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  İçerik & Açıklama:
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Sormak istediğiniz konuyu, Kazakça metin veya dil bilgisi örneğini detaylıca yazın..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800 font-normal leading-relaxed"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Etiketler (Virgülle ayırın):
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Örn: SoruCevap, Gramer, A2, Almatı"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-700 font-mono text-[11px]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Konuyu Paylaş</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Vazgeç
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
