const isProd = process.env.NODE_ENV === 'production'
const repoName = 'btmt-photobooth'

const basePath = isProd ? `/${repoName}` : ''

export function getAssetPath(path: string) {
  if (!path) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('data:')) return path
  if (path.startsWith(basePath)) return path
  return `${basePath}${path}`
}