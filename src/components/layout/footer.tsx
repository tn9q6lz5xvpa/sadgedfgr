export default function Footer() {
  return (
    <footer
      className="mt-16 px-6 py-8 text-center"
      style={{
        backgroundColor: 'var(--color-footer-bg)',
        color: 'var(--color-footer-text)',
      }}
    >
      <p>© {new Date().getFullYear()} Classic Bookstore. All rights reserved.</p>
      <p className="mt-2 text-sm">
        <a href="/(shop)/(content)/terms">Terms & Conditions</a> |{' '}
        <a href="/(shop)/(content)/policy">Privacy Policy</a>
      </p>
    </footer>
  );
}
