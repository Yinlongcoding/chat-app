import type { User, Chat, Message } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: 'me',
    username: 'me',
    displayName: '我',
    avatarColor: '#2AABEE',
    status: 'online',
    bio: '正在使用 TeleChat',
    phone: '+86 138 0000 0000',
  },
  {
    id: 'u1',
    username: 'alice',
    displayName: 'Alice Chen',
    avatarColor: '#E91E63',
    status: 'online',
    bio: '设计师 🎨',
    lastSeen: new Date(),
  },
  {
    id: 'u2',
    username: 'bob',
    displayName: 'Bob Wang',
    avatarColor: '#4CAF50',
    status: 'recently',
    bio: '全栈工程师',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'u3',
    username: 'carol',
    displayName: 'Carol Liu',
    avatarColor: '#FF9800',
    status: 'offline',
    bio: '产品经理 📱',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'u4',
    username: 'dave',
    displayName: 'Dave Zhang',
    avatarColor: '#9C27B0',
    status: 'online',
    bio: '数据分析师 📊',
    lastSeen: new Date(),
  },
  {
    id: 'u5',
    username: 'eve',
    displayName: 'Eve Li',
    avatarColor: '#00BCD4',
    status: 'offline',
    bio: '前端开发 💻',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const now = new Date();
const mins = (n: number) => new Date(now.getTime() - n * 60000);
const hours = (n: number) => new Date(now.getTime() - n * 3600000);
const days = (n: number) => new Date(now.getTime() - n * 86400000);

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'c1': [
    { id: 'm1', chatId: 'c1', senderId: 'u1', content: '嗨！最近怎么样？', type: 'text', timestamp: hours(2), status: 'read' },
    { id: 'm2', chatId: 'c1', senderId: 'me', content: '还不错！在忙一个新项目，你呢？', type: 'text', timestamp: hours(2), status: 'read' },
    { id: 'm3', chatId: 'c1', senderId: 'u1', content: '我在做一个 UI 设计，挺有挑战的 😅', type: 'text', timestamp: mins(90), status: 'read' },
    { id: 'm4', chatId: 'c1', senderId: 'me', content: '需要帮忙吗？', type: 'text', timestamp: mins(85), status: 'read' },
    { id: 'm5', chatId: 'c1', senderId: 'u1', content: '如果你有空的话，我们可以视频通话讨论一下', type: 'text', timestamp: mins(80), status: 'read' },
    { id: 'm6', chatId: 'c1', senderId: 'me', content: '没问题，今晚 8 点怎么样？', type: 'text', timestamp: mins(75), status: 'read' },
    { id: 'm7', chatId: 'c1', senderId: 'u1', content: '👍 好的，到时见！', type: 'text', timestamp: mins(70), status: 'read' },
    { id: 'm8', chatId: 'c1', senderId: 'u1', content: '对了，你用的什么框架做的项目？', type: 'text', timestamp: mins(10), status: 'read' },
    { id: 'm9', chatId: 'c1', senderId: 'me', content: 'React + TypeScript，搭配 Tailwind CSS', type: 'text', timestamp: mins(8), status: 'read' },
    { id: 'm10', chatId: 'c1', senderId: 'u1', content: '太棒了！我也在学 React 😄', type: 'text', timestamp: mins(5), status: 'read' },
  ],
  'c2': [
    { id: 'm11', chatId: 'c2', senderId: 'u2', content: '服务器部署好了吗？', type: 'text', timestamp: hours(5), status: 'read' },
    { id: 'm12', chatId: 'c2', senderId: 'me', content: '还差最后一步，CI/CD 流程有点问题', type: 'text', timestamp: hours(4), status: 'read' },
    { id: 'm13', chatId: 'c2', senderId: 'u2', content: '是 GitHub Actions 吗？我遇到过类似的坑', type: 'text', timestamp: hours(4), status: 'read' },
    { id: 'm14', chatId: 'c2', senderId: 'me', content: '对，你是怎么解决的？', type: 'text', timestamp: hours(3), status: 'read' },
    { id: 'm15', chatId: 'c2', senderId: 'u2', content: '在 workflow 里加上 NODE_ENV=production 就好了', type: 'text', timestamp: hours(3), status: 'read' },
    { id: 'm16', chatId: 'c2', senderId: 'me', content: '哇，真的可以了！谢谢！🎉', type: 'text', timestamp: hours(2), status: 'read' },
    { id: 'm17', chatId: 'c2', senderId: 'u2', content: '哈哈，不客气。下次记得多看文档 😂', type: 'text', timestamp: mins(30), status: 'read' },
  ],
  'c3': [
    { id: 'm18', chatId: 'c3', senderId: 'u3', content: '下周的产品评审时间定了吗？', type: 'text', timestamp: days(1), status: 'read' },
    { id: 'm19', chatId: 'c3', senderId: 'me', content: '周三下午 3 点，会议室 B', type: 'text', timestamp: days(1), status: 'read' },
    { id: 'm20', chatId: 'c3', senderId: 'u3', content: '好的，我会提前准备好 PRD 文档', type: 'text', timestamp: days(1), status: 'read' },
    { id: 'm21', chatId: 'c3', senderId: 'u3', content: '顺便问一下，原型图要用 Figma 还是 Axure？', type: 'text', timestamp: mins(45), status: 'delivered' },
  ],
  'c4': [
    { id: 'm22', chatId: 'c4', senderId: 'me', content: '大家好！我是新加入的成员', type: 'text', timestamp: days(3), status: 'read' },
    { id: 'm23', chatId: 'c4', senderId: 'u1', content: '欢迎欢迎！😊', type: 'text', timestamp: days(3), status: 'read' },
    { id: 'm24', chatId: 'c4', senderId: 'u2', content: '欢迎加入前端开发群！', type: 'text', timestamp: days(3), status: 'read' },
    { id: 'm25', chatId: 'c4', senderId: 'u4', content: '最近有没有好的 React 学习资源推荐？', type: 'text', timestamp: hours(6), status: 'read' },
    { id: 'm26', chatId: 'c4', senderId: 'u1', content: '官方文档最新的 beta 版本很好，推荐看看', type: 'text', timestamp: hours(5), status: 'read' },
    { id: 'm27', chatId: 'c4', senderId: 'me', content: 'React 官网的新文档确实写得不错，有很多实际例子', type: 'text', timestamp: hours(4), status: 'read' },
    { id: 'm28', chatId: 'c4', senderId: 'u2', content: '还有就是 Kent C. Dodds 的博客，质量很高', type: 'text', timestamp: hours(3), status: 'read' },
    { id: 'm29', chatId: 'c4', senderId: 'u5', content: '大家觉得 Zustand 和 Redux Toolkit 哪个更好用？', type: 'text', timestamp: mins(20), status: 'read' },
    { id: 'm30', chatId: 'c4', senderId: 'u4', content: '个人更喜欢 Zustand，API 更简洁', type: 'text', timestamp: mins(15), status: 'read' },
    { id: 'm31', chatId: 'c4', senderId: 'u1', content: '同意！Zustand 上手快，小项目首选', type: 'text', timestamp: mins(5), status: 'read' },
  ],
  'c5': [
    { id: 'm32', chatId: 'c5', senderId: 'u4', content: '🚀 TeleChat 技术频道正式开通！', type: 'text', timestamp: days(7), status: 'read' },
    { id: 'm33', chatId: 'c5', senderId: 'u4', content: '【React 18 新特性】\n并发模式正式发布，useTransition 和 useDeferredValue 让 UI 更流畅', type: 'text', timestamp: days(5), status: 'read' },
    { id: 'm34', chatId: 'c5', senderId: 'u4', content: '【TypeScript 5.0 发布】\n新增装饰器标准支持，const 类型参数推断增强', type: 'text', timestamp: days(3), status: 'read' },
    { id: 'm35', chatId: 'c5', senderId: 'u4', content: '【每日一题】\n请问 useCallback 和 useMemo 的区别是什么？', type: 'text', timestamp: hours(12), status: 'read' },
    { id: 'm36', chatId: 'c5', senderId: 'u4', content: '今日技术文章推荐：《深入理解 JavaScript 事件循环》', type: 'text', timestamp: mins(2), status: 'read' },
  ],
  'c6': [
    { id: 'm37', chatId: 'c6', senderId: 'u5', content: '你好，有时间做个项目合作吗？', type: 'text', timestamp: days(2), status: 'read' },
    { id: 'm38', chatId: 'c6', senderId: 'me', content: '什么项目？可以说说', type: 'text', timestamp: days(2), status: 'read' },
    { id: 'm39', chatId: 'c6', senderId: 'u5', content: '一个在线教育平台，主要做前端部分', type: 'text', timestamp: days(2), status: 'read' },
    { id: 'm40', chatId: 'c6', senderId: 'me', content: '听起来不错！具体技术栈是什么？', type: 'text', timestamp: days(1), status: 'read' },
    { id: 'm41', chatId: 'c6', senderId: 'u5', content: 'Next.js + Tailwind，后端用 Nest.js', type: 'text', timestamp: hours(8), status: 'delivered' },
  ],
};

export const MOCK_CHATS: Chat[] = [
  {
    id: 'c1',
    type: 'private',
    name: 'Alice Chen',
    avatarColor: '#E91E63',
    members: ['me', 'u1'],
    lastMessage: MOCK_MESSAGES['c1'][MOCK_MESSAGES['c1'].length - 1],
    unreadCount: 0,
    pinned: true,
    muted: false,
    createdAt: days(30),
  },
  {
    id: 'c2',
    type: 'private',
    name: 'Bob Wang',
    avatarColor: '#4CAF50',
    members: ['me', 'u2'],
    lastMessage: MOCK_MESSAGES['c2'][MOCK_MESSAGES['c2'].length - 1],
    unreadCount: 1,
    pinned: false,
    muted: false,
    createdAt: days(20),
  },
  {
    id: 'c3',
    type: 'private',
    name: 'Carol Liu',
    avatarColor: '#FF9800',
    members: ['me', 'u3'],
    lastMessage: MOCK_MESSAGES['c3'][MOCK_MESSAGES['c3'].length - 1],
    unreadCount: 2,
    pinned: false,
    muted: false,
    createdAt: days(15),
  },
  {
    id: 'c4',
    type: 'group',
    name: '前端开发交流群',
    avatarColor: '#2AABEE',
    members: ['me', 'u1', 'u2', 'u4', 'u5'],
    lastMessage: MOCK_MESSAGES['c4'][MOCK_MESSAGES['c4'].length - 1],
    unreadCount: 3,
    pinned: true,
    muted: false,
    description: '分享前端开发经验，讨论技术问题',
    createdAt: days(60),
  },
  {
    id: 'c5',
    type: 'channel',
    name: '技术周刊',
    avatarColor: '#9C27B0',
    members: ['me', 'u4'],
    lastMessage: MOCK_MESSAGES['c5'][MOCK_MESSAGES['c5'].length - 1],
    unreadCount: 5,
    pinned: false,
    muted: false,
    description: '每日精选技术文章和编程资讯',
    subscriberCount: 1247,
    createdAt: days(90),
  },
  {
    id: 'c6',
    type: 'private',
    name: 'Eve Li',
    avatarColor: '#00BCD4',
    members: ['me', 'u5'],
    lastMessage: MOCK_MESSAGES['c6'][MOCK_MESSAGES['c6'].length - 1],
    unreadCount: 0,
    pinned: false,
    muted: true,
    createdAt: days(10),
  },
];

export const getUserById = (id: string): User | undefined =>
  MOCK_USERS.find(u => u.id === id);

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
  }
};

export const formatFullTime = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
};
