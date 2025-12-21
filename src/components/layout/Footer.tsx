import { Github, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-ink-gray/20 bg-ink-black text-paper-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold">华构解码</h3>
            <p className="mt-2 text-sm text-paper-white/70">
              用现代科技解读中国古代建筑的智慧密码
            </p>
            <p className="mt-4 text-xs text-paper-white/50">
              2026 4C大赛参赛作品
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium">功能模块</h4>
            <ul className="mt-3 space-y-2 text-sm text-paper-white/70">
              <li>
                <a href="/codex" className="hover:text-paper-white">
                  建筑图鉴
                </a>
              </li>
              <li>
                <a href="/decoder" className="hover:text-paper-white">
                  结构解码
                </a>
              </li>
              <li>
                <a href="/cipher" className="hover:text-paper-white">
                  文化密码
                </a>
              </li>
              <li>
                <a href="/immersive" className="hover:text-paper-white">
                  沉浸漫游
                </a>
              </li>
              <li>
                <a href="/dataviz" className="hover:text-paper-white">
                  数据可视
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium">联系我们</h4>
            <div className="mt-3 flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper-white/70 hover:text-paper-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="text-paper-white/70 hover:text-paper-white"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-paper-white/10 pt-8 text-center text-xs text-paper-white/50">
          <p>© 2024-2026 华构解码. 探索中华建筑之美.</p>
          <p className="mt-1">
            技术栈: React + Three.js + Cloudflare
          </p>
        </div>
      </div>
    </footer>
  )
}
