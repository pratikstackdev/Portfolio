import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Code2,
  Globe2,
  Cpu,
  Sprout
} from 'lucide-react'

const sections = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

const projects = [
  {
    no: '01',
    title: 'Personal Portfolio',
    type: 'WEB EXPERIENCE',
    description: 'A personal space to bring together my work, technical interests, certifications, and the ideas I want to explore next.',
    stack: 'React · TypeScript · Tailwind CSS',
    visual: 'portfolio',
    status: 'THIS WEBSITE',
  },
  {
    no: '02',
    title: 'IRIS',
    type: 'MAC-INTEGRATED ASSISTANT CONCEPT',
    description: 'Intelligent Responsive Interactive System — a concept for a virtual assistant designed around a more natural desktop workflow.',
    stack: 'Exploration · Desktop interaction',
    visual: 'iris',
    status: 'CONCEPT',
  },
  {
    no: '03',
    title: 'Bone Conduction Device',
    type: 'HARDWARE EXPLORATION',
    description: 'Exploring audio transmission through vibration components and a Bluetooth transceiver. Project status and performance remain to be documented.',
    stack: 'Bluetooth transceiver · Vibration components',
    visual: 'bone',
    status: 'PROTOTYPE / CONCEPT',
  },
  {
    no: '04',
    title: 'Portable ECG Device',
    type: 'EMBEDDED SYSTEMS CONCEPT',
    description: 'An embedded-systems exploration of ECG signal capture, data handling, and readable output using a sensor and ESP32.',
    stack: 'ESP32 · ECG sensor/chip',
    visual: 'ecg',
    status: 'CONCEPT',
  },
]

const skillGroups = [
  { label: '01 / PROGRAMMING', items: ['C', 'C++', 'Python', 'Java (basic)'] },
  { label: '02 / WEB DEVELOPMENT', items: ['HTML', 'CSS'] },
  { label: '03 / EMBEDDED SYSTEMS', items: ['Arduino UNO', 'Arduino Nano', 'ESP32', 'Raspberry Pi'] },
  { label: '04 / CURRENTLY LEARNING', items: ['Go'] },
]


function ParticleGlobe({ variant = 'about' }: { variant?: 'hero' | 'about' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let frame = 0
    let raf = 0
    let width = 0
    let height = 0
    let mx = 0
    let my = 0
    let targetX = 0
    let targetY = 0
    let scrollProgress = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dots: { x: number; y: number; z: number; size: number; phase: number }[] = []
    const count = 1050
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const a = Math.PI * (3 - Math.sqrt(5)) * i
      dots.push({ x: Math.cos(a) * radius, y, z: Math.sin(a) * radius, size: Math.random() * 1.05 + .25, phase: Math.random() * Math.PI * 2 })
    }
    const resize = () => {
      const r = canvas.getBoundingClientRect(); width = r.width; height = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      targetY = ((e.clientX - r.left) / r.width - .5) * 1.15
      targetX = ((e.clientY - r.top) / r.height - .5) * -.85
    }
    const leave = () => { targetX = 0; targetY = 0 }
    const updateScroll = () => {
      const r = canvas.getBoundingClientRect()
      // The hero field responds to the page leaving the opening frame; the about field
      // keeps its softer in-view morph.
      scrollProgress = variant === 'hero'
        ? Math.max(0, Math.min(1, -r.top / Math.max(1, window.innerHeight * .72)))
        : Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height)))
    }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', updateScroll, { passive: true })
    resize(); updateScroll()
    const draw = () => {
      if (!reducedMotion) frame += .0032
      mx += (targetX - mx) * .035; my += (targetY - my) * .035
      ctx.clearRect(0, 0, width, height)
      const cx = width / 2, cy = height / 2
      const burst = variant === 'hero' ? scrollProgress : 0
      const radius = Math.min(width, height) * (.37 + (variant === 'hero' ? burst * .24 : scrollProgress * .045))
      const morph = variant === 'hero' ? burst : Math.sin(scrollProgress * Math.PI)
      const points = dots.map(d => {
        const a = frame + my + scrollProgress * .9, ca = Math.cos(a), sa = Math.sin(a)
        const x = d.x * ca - d.z * sa, z = d.x * sa + d.z * ca
        const b = mx + scrollProgress * .16, cb = Math.cos(b), sb = Math.sin(b)
        const y = d.y * cb - z * sb, zz = d.y * sb + z * cb
        const wave = 1 + Math.sin(d.phase + frame * 1.4 + scrollProgress * 5) * (.012 + morph * .025)
        const squashX = 1 - morph * .14
        const squashY = 1 + morph * .08
        const drift = burst * (Math.sin(d.phase * 1.7) * width * .16 + width * .07)
        const outwardX = x / Math.max(.001, Math.hypot(x, y))
        const outwardY = y / Math.max(.001, Math.hypot(x, y))
        return { x: cx + x * radius * wave * squashX + outwardX * drift, y: cy + y * radius * wave * squashY + outwardY * drift, z: zz, size: d.size * (1 + burst * .45), phase: d.phase }
      }).sort((a, b) => a.z - b.z)
      points.forEach(p => {
        const alpha = .12 + ((p.z + 1) / 2) * .68
        const shimmer = Math.sin(p.phase + frame * 2.2 + scrollProgress * 8) > .92
        ctx.beginPath()
        ctx.fillStyle = shimmer ? `rgba(255,220,174,${alpha})` : `rgba(214,163,107,${alpha})`
        ctx.arc(p.x, p.y, p.size * (.6 + (p.z + 1) * .58), 0, Math.PI * 2)
        ctx.fill()
      })
      // Fine latitude and orbit strokes shift as the globe responds to page scroll.
      ctx.beginPath(); ctx.ellipse(cx, cy, radius * (1.01 + morph * .05), radius * (.27 + morph * .13), -.25 + mx * .3 + scrollProgress * .4, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(214,163,107,${.12 + morph * .12})`; ctx.lineWidth = 1; ctx.stroke()
      ctx.beginPath(); ctx.ellipse(cx, cy, radius * .82, radius * .2, .65 + scrollProgress * .7, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(214,163,107,.08)'; ctx.stroke()
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave)
      window.removeEventListener('resize', resize); window.removeEventListener('scroll', updateScroll)
    }
  }, [])
  return <div className={`globe-interactive ${variant === 'hero' ? 'globe-hero' : ''}`}>
    <canvas ref={canvasRef} aria-label="Interactive particle globe. Move your pointer and scroll to change its rotation and shape." role="img" />
    <div className="globe-hint"><span className="globe-pulse" /> INTERACTIVE FIELD <span>MOVE / SCROLL</span></div>
  </div>
}


function RippleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let width = 0, height = 0, raf = 0, frame = 0
    let pointerX = -1000, pointerY = -1000
    let targetX = -1000, targetY = -1000
    const rings: { x: number; y: number; radius: number; alpha: number }[] = []
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width; height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr; canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetX = event.clientX - rect.left; targetY = event.clientY - rect.top
    }
    const leave = () => { targetX = -1000; targetY = -1000 }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    window.addEventListener('resize', resize)
    resize()
    const draw = () => {
      frame++
      pointerX += (targetX - pointerX) * .12
      pointerY += (targetY - pointerY) * .12
      ctx.clearRect(0, 0, width, height)
      const cx = width * .72, cy = height * .47
      for (let i = 0; i < 12; i++) {
        const r = ((frame * .22 + i * 38) % 470) + 10
        const alpha = (1 - (r % 470) / 470) * .15
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(214,163,107,${alpha})`; ctx.lineWidth = .7; ctx.stroke()
      }
      if (pointerX > -100 && pointerY > -100 && frame % 8 === 0) rings.push({ x: pointerX, y: pointerY, radius: 4, alpha: .38 })
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i]; ring.radius += 1.25; ring.alpha -= .0035
        if (ring.alpha <= 0) { rings.splice(i, 1); continue }
        ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(226,177,120,${ring.alpha})`; ctx.lineWidth = 1; ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf); canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave); window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={canvasRef} className="ripple-canvas" aria-label="Decorative interactive ripple field that responds to pointer movement" role="img" />
}

function ProjectVisual({ kind }: { kind: string }) {
  if (kind === 'ecg') return <div className="visual visual-ecg"><div className="ecg-label">SIGNAL / 001</div><svg viewBox="0 0 600 240" role="img" aria-label="Stylized ECG waveform concept"><path className="grid-lines" d={Array.from({length:13},(_,i)=>`M ${i*50} 0 V 240`).join(' ')} /><path className="grid-lines" d={Array.from({length:6},(_,i)=>`M 0 ${i*48} H 600`).join(' ')} /><path className="wave" d="M0 130 L70 130 L86 125 L98 130 L118 130 L133 111 L146 155 L160 44 L177 187 L194 130 L240 130 L256 125 L270 130 L300 130 L315 111 L328 155 L343 44 L360 187 L376 130 L430 130 L446 125 L460 130 L480 130 L495 111 L508 155 L523 44 L540 187 L557 130 L600 130" /></svg><span className="visual-caption">SIGNAL STUDY / NOT FOR CLINICAL USE</span></div>
  if (kind === 'bone') return <div className="visual visual-bone"><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="device-core"><span>BC</span></div><div className="node node-a" /><div className="node node-b" /><div className="node node-c" /><div className="visual-index">VIBRATION / AUDIO</div><span className="visual-caption">TRANSMISSION CONCEPT</span></div>
  if (kind === 'iris') return <div className="visual visual-iris visual-iris-image"><img className="iris-project-image" src="/images/iris-ai-assistant.png" alt="IRIS virtual assistant concept displayed as a futuristic AI desktop interface"/><div className="iris-image-label"><span>IRIS</span><span>VIRTUAL ASSISTANT / CONCEPT</span></div></div>
  return <div className="visual visual-portfolio"><div className="mini-browser"><div className="browser-top"><span /><span /><span /><em>pratik / portfolio</em></div><div className="browser-copy"><small>COMPUTER SCIENCE & ENGINEERING</small><strong>Ideas into<br/><i>interfaces.</i></strong><div className="browser-line" /></div><div className="browser-slice" /></div><span className="visual-caption">DESIGN / DEVELOPMENT / ITERATION</span></div>
}

export default function App() {
  const [active, setActive] = useState('top')
  const [menuOpen, setMenuOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id) })
    }, { rootMargin: '-35% 0px -55% 0px' })
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section))
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      document.documentElement.style.setProperty('--scroll-progress', `${max > 0 ? window.scrollY / max * 100 : 0}%`)
      document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 36)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  const jump = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return <div className="site-shell">
    <div className="scroll-progress" />
    <header className="navbar">
      <a className="wordmark full-name" href="#top" onClick={(e) => { e.preventDefault(); jump('top') }}>Pratik Srivastava<span>.</span></a>
      <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
        {sections.map(s => <a key={s.id} className={active === s.id ? 'active' : ''} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); jump(s.id) }}>{s.label}</a>)}
        <a className="nav-resume" href="#contact" onClick={(e) => { e.preventDefault(); jump('contact') }}>Let’s talk <ArrowUpRight size={13}/></a>
      </nav>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <section className="hero hero-editorial" id="top">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="hero-globe-layer"><ParticleGlobe variant="hero" /></div>
        <motion.img className="hero-portrait" src="/images/pratik-portrait-enhanced.png" alt="Portrait of Pratik Srivastava" fetchPriority="high" initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, delay: .12, ease: [0.22, 1, 0.36, 1] }} />
        <div className="hero-shade" />
        <div className="hero-meta"><span><i className="status-dot" /> CSE STUDENT<br className="meta-mobile-break" /> /<br className="meta-mobile-break" /> BUILDING TOMORROW</span><span>BASED IN INDIA · THINKING BEYOND</span></div>
        <aside className="hero-side-note"><span>01 / PRESENCE</span><b>＋</b><p>ENGINEERING<br/>EDUCATION<br/>HUMAN CONNECTION</p></aside>
        <motion.div className="hero-content" initial={reduceMotion ? false : { opacity: 0, y: 28, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .95, delay: .25, ease: [0.22, 1, 0.36, 1] }}>
          <p className="eyebrow"><span className="eyebrow-line" /> HELLO, I’M</p>
          <h1>Pratik <span>Srivastava</span></h1>
          <div className="hero-bottom">
            <div><p className="hero-role">COMPUTER SCIENCE ENGINEER</p><p className="hero-intro">I build scalable web experiences, solve real-world problems, and turn ideas into meaningful products.</p></div>
            <div className="hero-actions"><a className="button button-light" href="#work" onClick={(e) => { e.preventDefault(); jump('work') }}>View Projects <ArrowUpRight size={15}/></a><a className="text-link" href="/assets/Pratik-Srivastava-Resume.pages" download>Download CV <ArrowDownRight size={15}/></a></div>
          </div>
        </motion.div>
        <div className="hero-code-note" aria-hidden="true">const dreams = &#123;<br />&nbsp;&nbsp;code: true,<br />&nbsp;&nbsp;future: bright<br />&#125;;</div>
        <div className="hero-motion-toggle" aria-hidden="true"><span>Ⅱ</span> MOTION ON</div>
      </section>

      <section className="about section-pad" id="about">
        <div className="section-kicker"><span>01</span><span>ABOUT PRATIK</span></div>
        <div className="about-editorial">
          <motion.div className="about-heading" initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .7 }}>
            <p className="about-overline">A CURIOUS MIND, A PRACTICAL APPROACH</p>
            <h2>Technology is<br/>the starting point.<br/><em>People are the point.</em></h2>
            <p className="about-intro">I’m Pratik Srivastava, a Computer Science and Engineering graduate from Roorkee Institute of Technology. I enjoy building practical software, exploring AI-powered experiences like IRIS, and connecting code with real-world devices.</p>
            <a className="inline-link" href="#contact" onClick={(e) => { e.preventDefault(); jump('contact') }}>Start a conversation <ArrowUpRight size={15}/></a>
          </motion.div>
          <motion.div className="about-globe-panel about-ripple-panel" initial={reduceMotion ? false : { opacity: 0, scale: .97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .8, delay: .12 }}>
            <div className="globe-topline"><span>PRATIK SRIVASTAVA</span><span>CSE · 2022—2026</span></div>
            <div className="about-portrait-ripple"><img src="/images/pratik-about-portrait.png" alt="Pratik Srivastava in a navy suit"/><RippleField /></div>
            <div className="ripple-caption"><span className="globe-pulse" /> COMPUTER SCIENCE & ENGINEERING</div>
            <p className="globe-note">Roorkee Institute of Technology · Interested in AI assistants, web development, and embedded systems.</p>
          </motion.div>
          <div className="about-detail-row">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55 }}><span className="detail-index">01</span><h3>Software</h3><p>Programming foundations and web technologies, with an emphasis on learning through implementation.</p></motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .1 }}><span className="detail-index">02</span><h3>Embedded systems</h3><p>Exploring the bridge between code and hardware through Arduino, ESP32 and Raspberry Pi.</p></motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .2 }}><span className="detail-index">03</span><h3>Learning by building</h3><p>From IRIS to device concepts, each project is a chance to test an idea and deepen my understanding.</p></motion.div>
          </div>
        </div>
      </section>
      <section className="work section-pad" id="work">
        <div className="section-kicker"><span>02</span><span>SELECTED EXPLORATIONS</span></div>
        <div className="section-heading"><h2>Things I’ve<br/><em>been building.</em></h2><p>A selection of projects and concepts —<br/>each one a chance to learn by doing.</p></div>
        <div className="project-list">
          {projects.map((p, i) => <motion.article className={`project project-${i + 1}`} key={p.no} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.55, delay: reduceMotion ? 0 : i * 0.04 }}>
            <div className="project-info"><div className="project-overline"><span>{p.no} / 04</span><span>{p.type}</span></div><h3>{p.title}</h3><p>{p.description}</p><div className="project-bottom"><span>{p.stack}</span><span className="project-status">{p.status}</span></div></div>
            <ProjectVisual kind={p.visual}/>
          </motion.article>)}
        </div>
      </section>

      <section className="skills section-pad" id="skills">
        <div className="section-kicker"><span>03</span><span>TOOLS & CURIOSITY</span></div>
        <div className="skills-heading"><h2>Tools I<br/><em>work with.</em></h2><p>Skills are a work in progress.<br/>Here’s what I’m exploring and using.</p></div>
        <div className="skill-groups">{skillGroups.map((group, index) => {
          const SkillIcon = [Code2, Globe2, Cpu, Sprout][index]
          return <motion.article className="skill-card" key={group.label} initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} whileHover={reduceMotion ? undefined : { y: -6 }} transition={{ duration: .45, delay: reduceMotion ? 0 : index * .08 }}>
            <div className="skill-card-top"><span className="skill-card-icon"><SkillIcon size={21} strokeWidth={1.5} /></span><span className="skill-label">{group.label}</span><span className="skill-card-index">0{index + 1}</span></div>
            <div className="skill-items">{group.items.map(item => <span key={item}>{item}</span>)}</div>
            <div className="skill-card-rule" />
          </motion.article>
        })}</div>
      </section>

      <section className="education section-pad" id="education">
        <div className="section-kicker"><span>04</span><span>LEARNING & RECOGNITION</span></div>
        <div className="education-grid"><div><h2>Built on<br/><em>learning.</em></h2><div className="edu-entry"><span className="micro-label">EDUCATION / 2022 — 2026</span><h3>B.Tech — Computer Science and Engineering</h3><p>Roorkee Institute of Technology</p><p className="muted">Affiliated with Uttarakhand Technical University, Dehradun</p><span className="edu-date">August 2022 – June 2026</span></div></div>
        <div className="certs"><h3 className="small-heading">CERTIFICATIONS</h3>
          <div className="cert-row"><span>01</span><div><b>C Training</b><p>Spoken Tutorial Project, IIT Bombay</p></div><strong>80%</strong><time>May 2023</time></div>
          <div className="cert-row"><span>02</span><div><b>Python 3.4.3 Training</b><p>Spoken Tutorial Project, IIT Bombay</p></div><strong>75%</strong><time>Dec 2023</time></div>
          <div className="cert-row"><span>03</span><div><b>Java Business Application Training</b><p>EduPyramids / SINE, IIT Bombay</p></div><strong>95%</strong><time>May 2025</time></div>
          <h3 className="small-heading achievement-label">ACHIEVEMENTS & COMMUNITY</h3>
          <div className="achievement"><span>↗</span> Winner — Technomax College Technical Event</div>
          <div className="achievement"><span>↗</span> Member — College Technical Club</div>
          <div className="achievement"><span>↗</span> Member — College Incubation Centre</div>
        </div></div>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="section-kicker"><span>05</span><span>OPEN TO GOOD CONVERSATIONS</span></div>
        <p className="contact-overline">HAVE A PROJECT, IDEA, OR OPPORTUNITY?</p>
        <h2>Let’s make<br/><em>something matter.</em></h2>
        <a className="contact-email" href="mailto:Pratikstack.dev@gmail.com">Pratikstack.dev@gmail.com <ArrowUpRight size={20}/></a>
        <div className="contact-bottom"><p>Always happy to connect, share ideas, and learn from others building things.</p><div className="social-links"><a href="https://www.linkedin.com/in/pratik-srivastava-884992368" target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn <ArrowUpRight size={13}/></a><a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub placeholder — update with your profile"><Github size={16}/> GitHub <ArrowUpRight size={13}/></a><a href="mailto:Pratikstack.dev@gmail.com"><Mail size={16}/> Email <ArrowUpRight size={13}/></a></div></div>
      </section>
    </main>
    <footer className="footer"><a className="wordmark full-name" href="#top" onClick={(e) => { e.preventDefault(); jump('top') }}>Pratik Srivastava<span>.</span></a><span>DESIGNED & BUILT WITH INTENTION</span><span>© PRATIK SRIVASTAVA 2026</span><a href="#top" onClick={(e) => { e.preventDefault(); jump('top') }}>BACK TO TOP ↑</a></footer>
  </div>
}