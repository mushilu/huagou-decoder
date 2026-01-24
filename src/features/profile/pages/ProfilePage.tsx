import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Edit2, LogOut, Heart, History, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { cn } from '@/lib/utils'

type Tab = 'info' | 'favorites' | 'history'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, token, logout, setUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user || !token) {
      navigate('/')
    }
  }, [user, token, navigate])

  useEffect(() => {
    if (user?.nickname) {
      setNickname(user.nickname)
    }
  }, [user])

  if (!user) return null

  const handleSaveNickname = async () => {
    if (!nickname.trim() || nickname === user.nickname) {
      setEditing(false)
      return
    }

    if (!token) return

    setSaving(true)
    try {
      const res = await authService.updateProfile(token, { nickname: nickname.trim() })
      if (res.success && res.user) {
        setUser(res.user)
      }
    } catch (e) {
      console.error('保存失败', e)
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { id: 'info' as Tab, label: '个人信息', icon: User },
    { id: 'favorites' as Tab, label: '我的收藏', icon: Heart },
    { id: 'history' as Tab, label: '浏览历史', icon: History },
  ]

  return (
    <div className="min-h-screen bg-paper-cream/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 用户头部 */}
        <div className="bg-paper-white rounded-2xl shadow-sm border border-ink-gray/10 p-6 mb-6">
          <div className="flex items-center gap-6">
            {/* 头像 */}
            <div className="relative group">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.nickname || '用户'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-paper-cream"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-glaze-blue/10 flex items-center justify-center border-4 border-paper-cream">
                  <User className="w-10 h-10 text-glaze-blue" />
                </div>
              )}
              <button className="absolute inset-0 rounded-full bg-ink-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* 用户信息 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {editing ? (
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="text-xl font-bold text-ink-black bg-paper-cream rounded-lg px-3 py-1 border border-ink-gray/20 focus:outline-none focus:ring-2 focus:ring-glaze-blue/30"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNickname()}
                  />
                ) : (
                  <h1 className="text-xl font-bold text-ink-black">
                    {user.nickname || user.email?.split('@')[0] || '用户'}
                  </h1>
                )}
                {editing ? (
                  <Button
                    size="sm"
                    onClick={handleSaveNickname}
                    disabled={saving}
                    className="bg-glaze-blue hover:bg-glaze-blue/90"
                  >
                    {saving ? '保存中...' : '保存'}
                  </Button>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1.5 rounded-lg hover:bg-paper-cream text-ink-gray hover:text-ink-black transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-ink-gray">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email || '未绑定邮箱'}</span>
              </div>
            </div>

            {/* 退出按钮 */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-vermilion/30 text-vermilion hover:bg-vermilion/5"
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </div>
        </div>

        {/* Tab 导航 */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'bg-ink-black text-paper-white'
                  : 'bg-paper-white text-ink-gray hover:text-ink-black hover:bg-paper-cream border border-ink-gray/10'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 内容 */}
        <div className="bg-paper-white rounded-2xl shadow-sm border border-ink-gray/10 p-6">
          {activeTab === 'info' && <ProfileInfo user={user} />}
          {activeTab === 'favorites' && <ProfileFavorites />}
          {activeTab === 'history' && <ProfileHistory />}
        </div>
      </div>
    </div>
  )
}

function ProfileInfo({ user }: { user: { id: string; email: string | null; nickname: string | null; avatar: string | null } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-ink-black border-b border-ink-gray/10 pb-3">账户信息</h2>

      <div className="grid gap-4">
        <div className="flex items-center justify-between py-3 border-b border-ink-gray/5">
          <span className="text-ink-gray">用户ID</span>
          <span className="text-ink-black font-mono text-sm">{user.id.slice(0, 8)}...</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-ink-gray/5">
          <span className="text-ink-gray">邮箱地址</span>
          <span className="text-ink-black">{user.email || '未绑定'}</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-ink-gray/5">
          <span className="text-ink-gray">昵称</span>
          <span className="text-ink-black">{user.nickname || '未设置'}</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-ink-gray/5">
          <span className="text-ink-gray">账户类型</span>
          <span className="px-2 py-0.5 bg-glaze-blue/10 text-glaze-blue rounded text-sm">注册用户</span>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-md font-bold text-ink-black mb-4">使用统计</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-paper-cream/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-vermilion">∞</div>
            <div className="text-xs text-ink-gray mt-1">AI对话次数</div>
          </div>
          <div className="bg-paper-cream/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-glaze-blue">0</div>
            <div className="text-xs text-ink-gray mt-1">收藏建筑</div>
          </div>
          <div className="bg-paper-cream/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-jade-green">0</div>
            <div className="text-xs text-ink-gray mt-1">浏览记录</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileFavorites() {
  return (
    <div className="text-center py-12">
      <Heart className="w-12 h-12 text-ink-gray/30 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-ink-black mb-2">暂无收藏</h3>
      <p className="text-ink-gray text-sm">浏览建筑时点击收藏按钮，即可在这里查看</p>
    </div>
  )
}

function ProfileHistory() {
  return (
    <div className="text-center py-12">
      <History className="w-12 h-12 text-ink-gray/30 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-ink-black mb-2">暂无浏览记录</h3>
      <p className="text-ink-gray text-sm">您浏览过的建筑和内容将在这里显示</p>
    </div>
  )
}
