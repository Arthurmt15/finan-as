'use client'

interface NumericKeypadProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function formatDisplay(raw: string): string {
  if (!raw || raw === '') return ''
  const num = parseFloat(raw)
  if (isNaN(num)) return raw
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function NumericKeypad({ value, onChange, placeholder }: NumericKeypadProps) {
  function handleKey(k: string) {
    if (k === 'backspace') {
      onChange(value.slice(0, -1))
    } else if (k === 'clear') {
      onChange('')
    } else if (k === ',') {
      if (!value.includes('.') && !value.includes(',')) {
        onChange(value + '.')
      }
    } else if (k >= '0' && k <= '9') {
      const parts = value.split(/[.,]/)
      if (parts.length === 2 && parts[1].length >= 2) return
      onChange(value + k)
    }
  }

  const keys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', ',', '⌫'],
  ]

  return (
    <div className="w-full">
      <div className="w-full bg-ps1-black border-2 border-ps1-white text-ps1-white font-pixel text-sm px-3 py-2 mb-3 text-right min-h-[42px]">
        {value ? `R$ ${formatDisplay(value)}` : placeholder || '0,00'}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {keys.flat().map((k) => (
          <button
            key={k}
            onClick={() => handleKey(k === '⌫' ? 'backspace' : k)}
            className="bg-ps1-blue-light border-2 border-ps1-white text-ps1-white font-pixel text-sm py-3
                       hover:bg-ps1-blue active:translate-y-0.5"
          >
            {k}
          </button>
        ))}
      </div>
      <button
        onClick={() => onChange('')}
        className="btn-ps1 w-full text-[10px]"
      >
        LIMPAR
      </button>
    </div>
  )
}
