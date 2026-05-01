import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type {
  HomeContent,
  AboutContent,
  TeamMember,
  Program,
  GetInvolvedContent,
  ContactContent,
  SiteSettings,
  ProgramsPageContent,
} from './types'

const contentDir = path.join(process.cwd(), 'content')

function readContentFile<T>(filename: string): T & { body: string } {
  const filePath = path.join(contentDir, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { ...data, body: content } as T & { body: string }
}

function readCollection<T>(
  subdir: string,
): (T & { slug: string; body: string })[] {
  const dirPath = path.join(contentDir, subdir)
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md'))
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dirPath, file), 'utf-8')
    const { data, content } = matter(raw)
    const slug = file.replace(/\.md$/, '')
    return { ...data, slug, body: content } as T & {
      slug: string
      body: string
    }
  })
}

export function getSiteSettings(): SiteSettings {
  const filePath = path.join(contentDir, 'settings.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

export function getHomeContent(): HomeContent & { body: string } {
  return readContentFile<HomeContent>('home.md')
}

export function getAboutContent(): AboutContent & { body: string } {
  return readContentFile<AboutContent>('about.md')
}

export function getTeamMembers(): TeamMember[] {
  return readCollection<TeamMember>('team').sort((a, b) => a.order - b.order)
}

export function getPrograms(): Program[] {
  return readCollection<Program>('programs-list')
}

export function getProgramBySlug(slug: string): Program | undefined {
  return getPrograms().find((p) => p.slug === slug)
}

export function getGetInvolvedContent(): GetInvolvedContent & {
  body: string
} {
  return readContentFile<GetInvolvedContent>('get-involved.md')
}

export function getContactContent(): ContactContent & { body: string } {
  return readContentFile<ContactContent>('contact.md')
}

export function getProgramsPageContent(): ProgramsPageContent & {
  body: string
} {
  return readContentFile<ProgramsPageContent>('programs.md')
}
