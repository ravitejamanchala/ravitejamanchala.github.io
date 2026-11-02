import siteMetadata from '@/data/siteMetadata'
export default function Footer() {
  return (
    <footer className="folio-footer">
      <div>
        <strong>Raviteja Manchala</strong>
        <p>Engineer. Builder. Always curious.</p>
      </div>
      <div>
        <a href={siteMetadata.github}>GitHub ↗</a>
        <a href={siteMetadata.linkedin}>LinkedIn ↗</a>
        <a href={`mailto:${siteMetadata.email}`}>Email ↗</a>
      </div>
      <p>© {new Date().getFullYear()} · Built with intention.</p>
    </footer>
  )
}
