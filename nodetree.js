class Nodetree {
   constructor(k, a, b, c, d, n, hash) {
      this.k = k
      this.a = a
      this.b = b
      this.c = c
      this.d = d
      this.n = n
      this.hash = hash
   }
   hashCode() {
      return this.hash
   }
   toString() {
      return `Node k=${this.k}, ${1 << this.k} x ${1 << this.k}, pop ${this.n}`
   }
   nextGeneration() {}
   render(x, y, name) {
      if (this.n > 0) {
         if (this.k === 0) {
            fill(50)
            rect(x, y, resolution - 1, resolution - 1)
            // fill(10)
            // text(name, x, y + 5)
         } else {
            const offset = resolution * 2 ** (this.k - 2)
            this.a.render(x - offset, y - offset, 'a')
            this.b.render(x + offset, y - offset, 'b')
            this.c.render(x - offset, y + offset, 'c')
            this.d.render(x + offset, y + offset, 'd')
         }
      }
   }
}
