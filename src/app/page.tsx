import BookCard from '@/components/BookCard'


const sampleBooks = [
{ id: 1, title: 'The Timber Library', author: 'A. Storyteller', price: 24.99, cover: '/covers/book1.jpg' },
{ id: 2, title: 'Brown Bindings', author: 'E. Binder', price: 18.5, cover: '/covers/book2.jpg' },
{ id: 3, title: 'Pages & Grain', author: 'M. Carver', price: 32.0, cover: '/covers/book3.jpg' },
{ id: 4, title: 'Quiet Reading', author: 'L. Nook', price: 12.99, cover: '/covers/book4.jpg' },
]


export default function Home(){
return (
<div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10">
<section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
<div className="col-span-2 bg-[var(--warm-white)] p-6 rounded-2xl book-card">
<h1 className="text-3xl md:text-4xl">Welcome to The Book Haven</h1>
<p className="mt-3 text-[rgba(78,59,49,0.7)]">A curated collection of books chosen for their craft, story and soul. Find your next treasured read.</p>
<div className="mt-5">
<a href="/catalog" className="btn-wood">Browse the Catalog</a>
</div>
</div>


<aside className="bg-[var(--warm-white)] p-6 rounded-2xl book-card">
<h3 className="font-semibold">Today's picks</h3>
<ul className="mt-4 space-y-3 text-sm text-[rgba(78,59,49,0.8)]">
<li>📚 The Timber Library — $24.99</li>
<li>📚 Brown Bindings — $18.50</li>
<li>📚 Pages & Grain — $32.00</li>
</ul>
</aside>
</section>


<section>
<h2 className="text-2xl mb-4">Featured Titles</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
{sampleBooks.map(b => (
<BookCard key={b.id} book={b} />
))}
</div>
</section>
</div>
)
}