import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Layers, Sparkles, Globe, BarChart3, ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'
import { useCmsPage } from '@/hooks/useCmsPage'
import { cmsDefaults, type HomeFeatureIconKey } from '@/content/cmsDefaults'

const featureIconMap: Record<HomeFeatureIconKey, typeof BookOpen> = {
  BookOpen,
  Layers,
  Sparkles,
  Globe,
  BarChart3,
}

// 水墨粒子背景组件
function InkBackground({ imageUrl }: { imageUrl: string }) {
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    delay: i * 0.1,
    duration: 20 + Math.random() * 10,
    size: 2 + Math.random() * 4,
    opacity: 0.03 + Math.random() * 0.05,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 水墨故宫背景图 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageUrl})`,
          opacity: 0.6,
        }}
      />

      {/* 基础水墨渐变叠加 */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-black/70 via-ink-black/50 to-ink-black/80" />

      {/* 径向渐变光晕 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_var(--tw-gradient-stops))] from-ink-black/50 via-transparent to-transparent opacity-40" />

      {/* 水墨粒子动画 */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-paper-white"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -100],
            opacity: [particle.opacity, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* 水墨纹理叠加 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)',
          animation: 'sweep 20s linear infinite',
        }}
      />
    </div>
  )
}

export function HomePage() {
  const { content } = useCmsPage('home', cmsDefaults.home)
  const hero = { ...cmsDefaults.home.hero, ...content.hero }
  const features = content.features?.length ? content.features : cmsDefaults.home.features
  const stats = content.stats?.length ? content.stats : cmsDefaults.home.stats
  const cta = { ...cmsDefaults.home.cta, ...content.cta }

  const renderLines = (text: string) =>
    text.split('\n').map((line, index, arr) => (
      <span key={`${line}-${index}`}>
        {line}
        {index < arr.length - 1 && <br />}
      </span>
    ))

  return (
    <div className="min-h-screen">
      {/* 首屏 */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-ink-black">
        {/* 优化的水墨背景 */}
        <InkBackground imageUrl={hero.backgroundImage || cmsDefaults.home.hero.backgroundImage} />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl font-bold text-paper-white md:text-7xl">
              {hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-paper-white/70 md:text-xl">
              {renderLines(hero.subtitle)}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="vermilion" size="lg" asChild>
                <Link to={hero.primaryButtonLink}>
                  {hero.primaryButtonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-paper-white/30 text-paper-white hover:bg-paper-white hover:text-ink-black" asChild>
                <Link to={hero.secondaryButtonLink}>
                  {hero.secondaryButtonText}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* 装饰元素 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-paper-white to-transparent" />
      </section>

      {/* 功能展示 */}
      <section className="bg-gradient-to-b from-paper-white to-paper-cream py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-serif text-3xl font-bold text-ink-black md:text-4xl">
              五大功能模块
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-gray">
              从图鉴浏览到3D解码，从文化解读到沉浸体验，全方位感受中华建筑之美
            </p>
          </motion.div>

          {/* 功能卡片 */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {features.map((feature, idx) => {
              const Icon = featureIconMap[feature.icon] ?? BookOpen
              return (
                <motion.div
                  key={feature.path}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <CardContainer containerClassName="h-full">
                    <CardBody className="h-auto w-auto">
                      <Link to={feature.path} className="block h-full">
                        <Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 border-ink-gray/10 hover:border-ink-gray/30 hover:shadow-2xl">
                          {/* 背景梯度效果 */}
                          <div className="absolute inset-0 bg-gradient-to-br from-ink-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <CardItem className="w-full">
                            <CardHeader className="relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                <div className={`inline-flex rounded-lg bg-gradient-to-br from-ink-black/10 to-ink-black/5 p-3 ${feature.color}`}>
                                  <Icon className="h-6 w-6" />
                                </div>
                                <Badge variant={feature.badgeVariant} className="text-xs">
                                  {feature.badge}
                                </Badge>
                              </div>
                              <CardTitle className="group-hover:text-vermilion transition-colors duration-300">
                                {feature.title}
                              </CardTitle>
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs bg-paper-cream">
                                  {feature.category}
                                </Badge>
                              </div>
                            </CardHeader>
                          </CardItem>

                          <CardItem className="w-full">
                            <CardContent className="relative z-10">
                              <CardDescription className="text-ink-gray group-hover:text-ink-black transition-colors">
                                {feature.description}
                              </CardDescription>
                            </CardContent>
                          </CardItem>

                          {/* 底部高亮线 */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-vermilion to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Card>
                      </Link>
                    </CardBody>
                  </CardContainer>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 数据统计 */}
      <section className="bg-gradient-to-b from-ink-black to-ink-black/95 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl font-bold text-paper-white">
              数据规模
            </h2>
            <p className="mt-4 text-paper-white/60">
              庞大的古建筑档案库，全方位覆盖中华建筑文明
            </p>
          </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`relative overflow-hidden rounded-2xl border border-paper-white/10 bg-gradient-to-br ${stat.color} p-8 group`}>
                  {/* 背景光晕 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-paper-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="text-4xl mb-2">{stat.icon}</div>
                    <div className="font-serif text-4xl font-bold text-vermilion group-hover:text-gold transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="mt-4 text-paper-white/70 group-hover:text-paper-white/90 transition-colors">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 行动召唤 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-paper-white via-paper-cream to-paper-white py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="gold" className="mb-6 inline-block px-4 py-2">
              <Zap className="inline mr-2 h-4 w-4" />
              {cta.badge}
            </Badge>

            <h2 className="font-serif text-4xl font-bold text-ink-black md:text-5xl">
              {cta.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-gray">
              {renderLines(cta.description)}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button variant="vermilion" size="lg" asChild className="group">
                <Link to={cta.primaryButtonLink}>
                  {cta.primaryButtonText}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to={cta.secondaryButtonLink}>
                  {cta.secondaryButtonText}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* 装饰背景元素 */}
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-vermilion/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-glaze-blue/10 to-transparent blur-3xl" />
        </div>
      </section>
    </div>
  )
}
