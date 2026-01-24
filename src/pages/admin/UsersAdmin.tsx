import { useState, useEffect } from 'react'
import { Search, User, Trash2, MoreHorizontal, Mail, Calendar, Shield, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const RAW_BASE = import.meta.env.VITE_API_URL
const API_BASE = RAW_BASE ? RAW_BASE.replace(/\/$/, '') : ''
const ADMIN_TOKEN = 'huagou-admin'

interface UserItem {
  id: string
  email: string | null
  github_id: string | null
  nickname: string | null
  avatar: string | null
  created_at: number
  last_login: number
}

export function UsersAdmin() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      })
      const data = await res.json()
      if (data.users) setUsers(data.users)
    } catch (e) {
      console.error('获取用户失败', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('确定删除该用户？此操作不可撤销。')) return

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      })
      const data = await res.json()
      if (data.success) {
        setUsers(users.filter((u) => u.id !== userId))
        setSelectedUser(null)
      }
    } catch (e) {
      console.error('删除失败', e)
    }
  }

  const filteredUsers = users.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      u.email?.toLowerCase().includes(q) ||
      u.nickname?.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    )
  })

  function formatDate(ts: number) {
    return new Date(ts * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-gray/60">
            用户管理
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink-black">注册用户</h2>
          <p className="mt-2 text-sm text-ink-gray/70">
            管理平台注册用户，查看登录记录与账户信息。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-gray/50" />
            <input
              type="text"
              placeholder="搜索用户..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-ink-gray/20 bg-paper-white/80 py-2 pl-10 pr-4 text-sm text-ink-black placeholder:text-ink-gray/50 focus:border-ink-gray/40 focus:outline-none"
            />
          </div>
          <div className="rounded-xl border border-ink-gray/20 bg-paper-white/80 px-4 py-2 text-sm font-medium text-ink-black">
            共 {users.length} 人
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="rounded-2xl border border-ink-gray/15 bg-paper-white/90 shadow-ink overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-ink-gray">加载中...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-ink-gray">
            {search ? '未找到匹配用户' : '暂无注册用户'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-gray/10 bg-paper-cream/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-ink-gray/70">
                  用户
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-ink-gray/70">
                  邮箱
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-ink-gray/70">
                  登录方式
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-ink-gray/70">
                  注册时间
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-ink-gray/70">
                  最后登录
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-ink-gray/70">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-ink-gray/5 hover:bg-paper-cream/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-glaze-blue/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-glaze-blue" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-ink-black">
                          {user.nickname || '未设置昵称'}
                        </div>
                        <div className="text-xs text-ink-gray font-mono">{user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-black">{user.email || '-'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                        user.github_id
                          ? 'bg-ink-black/10 text-ink-black'
                          : 'bg-glaze-blue/10 text-glaze-blue'
                      )}
                    >
                      {user.github_id ? 'GitHub' : '邮箱'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-gray">{formatDate(user.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-ink-gray">{formatDate(user.last_login)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="rounded-lg p-2 hover:bg-ink-black/5 text-ink-gray hover:text-ink-black transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 用户详情弹窗 */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-ink-gray/15 bg-paper-white p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <h3 className="font-serif text-xl font-bold text-ink-black">用户详情</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-1 hover:bg-ink-black/5 text-ink-gray"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              {selectedUser.avatar ? (
                <img
                  src={selectedUser.avatar}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-glaze-blue/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-glaze-blue" />
                </div>
              )}
              <div>
                <div className="font-bold text-lg text-ink-black">
                  {selectedUser.nickname || '未设置昵称'}
                </div>
                <div className="text-sm text-ink-gray font-mono">{selectedUser.id}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-ink-gray" />
                <span className="text-ink-gray">邮箱：</span>
                <span className="text-ink-black">{selectedUser.email || '未绑定'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-ink-gray" />
                <span className="text-ink-gray">登录方式：</span>
                <span className="text-ink-black">
                  {selectedUser.github_id ? 'GitHub OAuth' : '邮箱验证码'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-ink-gray" />
                <span className="text-ink-gray">注册时间：</span>
                <span className="text-ink-black">{formatDate(selectedUser.created_at)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-ink-gray" />
                <span className="text-ink-gray">最后登录：</span>
                <span className="text-ink-black">{formatDate(selectedUser.last_login)}</span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 rounded-xl border border-ink-gray/20 py-2.5 text-sm font-medium text-ink-black hover:bg-paper-cream transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="flex items-center justify-center gap-2 rounded-xl bg-vermilion px-6 py-2.5 text-sm font-medium text-white hover:bg-vermilion/90 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                删除用户
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
