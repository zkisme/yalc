import fs from 'fs'
const ini = require('ini')

const validFlags = [
  'sig',
  'workspace-resolve',
  'dev-mod',
  'scripts',
  'quiet',
  'files',
]

const fileName = '.yalcrc'

// 读取配置文件
const readFile = (): Record<string, string | boolean> | null => {
  if (fs.existsSync(fileName)) {
    return ini.parse(fs.readFileSync(fileName, 'utf-8'))
  }
  return null
}

// 读取配置
export const readRcConfig = (): Record<string, string | boolean> => {
  const rcOptions = readFile()
  if (!rcOptions) return {}
    // 筛选不在列表里的参数
  const unknown = Object.keys(rcOptions).filter(
    (key) => !validFlags.includes(key)
  )

//   输出未识别参数并退出
  if (unknown.length) {
    console.warn(`Unknown option in ${fileName}: ${unknown[0]}`)
    process.exit()
  }
//   导出参数副本
  return Object.keys(rcOptions).reduce((prev, flag) => {
    return validFlags.includes(flag)
      ? { ...prev, [flag]: rcOptions[flag] }
      : prev
  }, {})
}
