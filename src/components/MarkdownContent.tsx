interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  // 分割内容为段落和部分
  const parts = content.split('\n').filter((line) => line.trim() !== '')

  return (
    <div className="space-y-6 text-ink-gray leading-relaxed">
      {parts.map((part, index) => {
        // H2 标题
        if (part.startsWith('## ')) {
          return (
            <h2 key={index} className="font-serif text-2xl font-bold text-ink-black mt-8 mb-4 border-l-4 border-vermilion pl-4">
              {part.replace('## ', '')}
            </h2>
          )
        }

        // H3 标题
        if (part.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-semibold text-ink-black mt-6 mb-3">
              {part.replace('### ', '')}
            </h3>
          )
        }

        // 列表项
        if (part.startsWith('- ')) {
          return (
            <div key={index} className="flex gap-3 items-start">
              <span className="text-vermilion font-bold mt-1">•</span>
              <p className="flex-1">
                {part
                  .replace('- ', '')
                  .split('**')
                  .map((segment, i) =>
                    i % 2 === 0 ? (
                      segment
                    ) : (
                      <strong key={i} className="font-semibold text-ink-black">
                        {segment}
                      </strong>
                    )
                  )}
              </p>
            </div>
          )
        }

        // 普通段落
        return (
          <p key={index}>
            {part.split('**').map((segment, i) =>
              i % 2 === 0 ? (
                segment
              ) : (
                <strong key={i} className="font-semibold text-ink-black">
                  {segment}
                </strong>
              )
            )}
          </p>
        )
      })}
    </div>
  )
}
