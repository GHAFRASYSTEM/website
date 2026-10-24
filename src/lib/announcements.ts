export interface Announcement {
  id: string
  category: string
  title: string
  body: string
  image: string | null
  publishedAt: string
}

const CATEGORIES = ['News', 'Event', 'Housing', 'Personal', 'Update'] as const

export const ANNOUNCEMENTS_PAGE_SIZE = 7

export interface AnnouncementPageResult {
  announcements: Announcement[]
  page: number
  pages: number
  total: number
}

export function parseAnnouncementPage(value: string | undefined): number {
  const page = Number(value)
  if (!Number.isInteger(page) || page < 1) return 1
  return page
}

export class AnnouncementsRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AnnouncementsRequestError'
    this.status = status
  }
}

function apiUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim()
  const base = configured || 'https://backend-016i.onrender.com'
  return base.replace(/\/$/, '')
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return null
}

function pickString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return ''
}

function resolveImage(value: string): string | null {
  if (!value) return null
  if (value.startsWith('/')) return `${apiUrl()}${value}`
  return value
}

function pickImage(record: Record<string, unknown>): string | null {
  const keys = ['image_uri', 'image', 'imageUrl', 'image_url', 'coverImage', 'cover', 'thumbnail']
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return resolveImage(value.trim())
    const imageRecord = asRecord(value)
    if (!imageRecord) continue
    const url = pickString(imageRecord, ['url', 'src', 'path'])
    if (url) return resolveImage(url)
  }
  return null
}

function normalizeCategory(value: string): string {
  const match = CATEGORIES.find((category) => category.toLowerCase() === value.toLowerCase())
  return match ?? (value || 'News')
}

function publishedTime(value: string): number {
  const time = Date.parse(value)
  return Number.isNaN(time) ? 0 : time
}

export function normalizeAnnouncement(value: unknown): Announcement | null {
  const record = asRecord(value)
  if (!record) return null

  const id = pickString(record, ['id', '_id', 'announcementId', 'announcement_id'])
  const title = pickString(record, ['title', 'name'])
  if (!id || !title) return null

  return {
    id,
    category: normalizeCategory(pickString(record, ['category', 'type'])),
    title,
    body: pickString(record, ['body', 'content', 'description', 'message']),
    image: pickImage(record),
    publishedAt: pickString(record, [
      'publishedAt',
      'publishedDate',
      'published_at',
      'published_date',
      'createdAt',
      'created_at',
      'date',
    ]),
  }
}

function unwrapList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload

  const record = asRecord(payload)
  if (!record) return []

  const candidates = [record.data, record.announcements, record.items, record.results]
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate
    const nested = asRecord(candidate)
    if (!nested) continue
    for (const key of ['announcements', 'items', 'results', 'data']) {
      if (Array.isArray(nested[key])) return nested[key] as unknown[]
    }
  }

  return []
}

function unwrapItem(payload: unknown): unknown {
  const record = asRecord(payload)
  if (!record) return payload

  const data = record.data
  if (Array.isArray(data)) return data[0] ?? null

  const dataRecord = asRecord(data)
  if (dataRecord) {
    if (dataRecord.announcement) return dataRecord.announcement
    if ('title' in dataRecord || 'id' in dataRecord || '_id' in dataRecord) return dataRecord
  }

  if (record.announcement) return record.announcement
  return payload
}

async function readResponse(path: string): Promise<{ status: number; body: unknown }> {
  let response: Response
  try {
    response = await fetch(`${apiUrl()}${path}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
  } catch {
    throw new AnnouncementsRequestError(
      'We could not reach the announcements service. Please try again.',
      0,
    )
  }

  const text = await response.text()
  let body: unknown = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = null
    }
  }

  return { status: response.status, body }
}

function metaNumber(body: unknown, key: string, fallback: number): number {
  const meta = asRecord(asRecord(body)?.meta)
  const value = meta?.[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export async function fetchAnnouncements(
  page = 1,
  limit = ANNOUNCEMENTS_PAGE_SIZE,
): Promise<AnnouncementPageResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  const { status, body } = await readResponse(`/announcements?${params}`)
  if (status < 200 || status >= 300) {
    throw new AnnouncementsRequestError(
      'Announcements could not be loaded. Please try again.',
      status,
    )
  }

  const announcements = unwrapList(body)
    .map(normalizeAnnouncement)
    .filter((item): item is Announcement => item !== null)
    .sort((a, b) => publishedTime(b.publishedAt) - publishedTime(a.publishedAt))

  return {
    announcements,
    page: metaNumber(body, 'page', page),
    pages: Math.max(metaNumber(body, 'pages', 1), 1),
    total: metaNumber(body, 'total', announcements.length),
  }
}

export async function fetchAnnouncement(id: string): Promise<Announcement | null> {
  const { status, body } = await readResponse(`/announcements/${encodeURIComponent(id)}`)
  if (status === 404) return null
  if (status < 200 || status >= 300) {
    throw new AnnouncementsRequestError(
      'This announcement could not be loaded. Please try again.',
      status,
    )
  }

  return normalizeAnnouncement(unwrapItem(body))
}

export function announcementPlainText(body: string): string {
  return body
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/\s*(p|div|li|h[1-6]|blockquote|tr)\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export type AnnouncementBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

const LIST_ITEM = /^\s*[-•*]\s+(.*)$/

export function announcementBlocks(body: string): AnnouncementBlock[] {
  const blocks: AnnouncementBlock[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join('\n') })
    paragraph = []
  }
  const flushList = () => {
    if (list.length) blocks.push({ type: 'list', items: list })
    list = []
  }

  for (const rawLine of announcementPlainText(body).split('\n')) {
    const line = rawLine.trim()
    const item = LIST_ITEM.exec(line)
    if (!line) {
      flushParagraph()
      flushList()
    } else if (item) {
      flushParagraph()
      list.push(item[1])
    } else {
      flushList()
      paragraph.push(line)
    }
  }
  flushParagraph()
  flushList()

  return blocks
}

export function announcementReadingMinutes(body: string): number {
  const words = announcementPlainText(body).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function announcementPreview(body: string, maxLength = 160): string {
  const text = announcementPlainText(body).replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  const clipped = text.slice(0, maxLength)
  const lastSpace = clipped.lastIndexOf(' ')
  const preview = (lastSpace > 80 ? clipped.slice(0, lastSpace) : clipped).trim()
  return `${preview}…`
}

export function formatAnnouncementDate(value: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function announcementDateTime(value: string): string | undefined {
  if (!value || Number.isNaN(Date.parse(value))) return undefined
  return value
}
