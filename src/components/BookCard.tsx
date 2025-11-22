// FILE: src/components/BookCard.tsx
'use client'
import Image from 'next/image'
import React from 'react'


type Book = {
id: string | number
title: string
author: string
price: number
cover?: string
}


export default function BookCard({ book }: { book: Book }){
return (
<article className="book-card p-4 md:p-6 flex flex-col">
<div className="relative w-full pb-[140%] md:pb-[120%] rounded-md overflow-hidden mb-4">
{book.cover ? (
<Image src={book.cover} alt={book.title} fill className="object-cover" />
) : (
<div className="w-full h-full bg-gradient-to-b from-[rgba(0,0,0,0.03)] to-[rgba(0,0,0,0.01)] flex items-center justify-center text-sm text-[rgba(78,59,49,0.4)]">No cover</div>
)}
</div>


<div className="flex-1">
<h3 className="text-lg md:text-xl leading-tight mb-1">{book.title}</h3>
<p className="text-sm text-[rgba(78,59,49,0.7)] mb-3">{book.author}</p>
<div className="mt-auto flex items-center justify-between">
<div className="text-lg font-semibold">${book.price.toFixed(2)}</div>
<button className="btn-wood text-sm">Add to cart</button>
</div>
</div>
</article>
)
}

