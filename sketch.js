const resolution = 4
const on = new Nodetree(0, null, null, null, null, 1, 1)
const off = new Nodetree(0, null, null, null, null, 0, 0)
const dotColor = 100
let nodes
function setup() {
   createCanvas(windowWidth, windowHeight)
   background(27)
   fill(80)
   noStroke()
   rectMode(CENTER)
   textAlign(CENTER)
   translate(floor(width / 2), floor(height / 2))
   frameRate(10)
   nodes = get_random(5)
   nodes = centre(nodes)
   nodes = centre(nodes)
}
function draw() {
   background(27)

   text(floor(frameRate()), 20, 30)
   translate(floor(width / 2), floor(height / 2))

   // fill(20)
   // rect(0, 0, resolution * 2 ** nodes.k, resolution * 2 ** nodes.k)
   // fill(24)
   // rect(0, 0, resolution * 2 ** (nodes.k - 1), resolution * 2 ** (nodes.k - 1))
   nodes.render(0, 0)
   if (nodes.a.n || nodes.b.n || nodes.c.n || nodes.d.n) {
      //nodes = centre(nodes)
   }
   // fill(24)
   // rect(0, 0, resolution * 2 ** 5, resolution * 2 ** 5)
   const newNodes = successor(nodes)
   if (checkEdge(newNodes) && nodes.k < 9) {
      nodes = centre(centre(newNodes))
      console.log(nodes.k)
   } else {
      nodes = centre(newNodes)
   }
   // noLoop()
}

function checkEdge(node) {
   return (
      node.a.a.n ||
      node.a.b.n ||
      node.b.a.n ||
      node.b.b.n ||
      node.a.c.n ||
      node.b.d.n ||
      node.c.a.n ||
      node.c.c.n ||
      node.c.d.n ||
      node.d.b.n ||
      node.d.c.n ||
      node.d.d.n
   )
}
function keyPressed() {
   if (key === 'l') loop()
}

function joins(a, b, c, d) {
   const n = a.n + b.n + c.n + d.n
   const nhash =
      (a.k +
         2 +
         5131830419411 * a.hash +
         3758991985019 * b.hash +
         8973110871315 * c.hash +
         4318490180473 * d.hash) &
      ((1 << 63) - 1)
   return new Nodetree(a.k + 1, a, b, c, d, n, nhash)
}

function get_zero(k) {
   return k === 0
      ? off
      : joins(
           get_zero(k - 1),
           get_zero(k - 1),
           get_zero(k - 1),
           get_zero(k - 1),
        )
}

function centre(m) {
   z = get_zero(m.k - 1)
   return joins(
      joins(z, z, z, m.a),
      joins(z, z, m.b, z),
      joins(z, m.c, z, z),
      joins(m.d, z, z, z),
   )
}

function get_random(k) {
   return k === 0
      ? random() > 0.5
         ? on
         : off
      : joins(
           get_random(k - 1),
           get_random(k - 1),
           get_random(k - 1),
           get_random(k - 1),
        )
}
// Define the life rule for a 3x3 collection of cells, where E is the center
function life(a, b, c, d, E, f, g, h, i) {
   const outer = [a, b, c, d, f, g, h, i].reduce((sum, t) => sum + t.n, 0)
   return (E.n && outer === 2) || outer === 3 ? on : off
}

// Define the life rule for a 4x4 collection of cells
function life_4x4(m) {
   const ad = life(
      m.a.a,
      m.a.b,
      m.b.a,
      m.a.c,
      m.a.d,
      m.b.c,
      m.c.a,
      m.c.b,
      m.d.a,
   )
   const bc = life(
      m.a.b,
      m.b.a,
      m.b.b,
      m.a.d,
      m.b.c,
      m.b.d,
      m.c.b,
      m.d.a,
      m.d.b,
   )
   const cb = life(
      m.a.c,
      m.a.d,
      m.b.c,
      m.c.a,
      m.c.b,
      m.d.a,
      m.c.c,
      m.c.d,
      m.d.c,
   )
   const da = life(
      m.a.d,
      m.b.c,
      m.b.d,
      m.c.b,
      m.d.a,
      m.d.b,
      m.c.d,
      m.d.c,
      m.d.d,
   )
   return joins(ad, bc, cb, da)
}
function successor(m, j = null) {
   // Return the 2**k-1 x 2**k-1 successor, 2**j generations in the future
   if (m.n === 0) {
      // empty
      return m.a
   } else if (m.k === 2) {
      // base case
      const s = life_4x4(m)
      return s
   } else {
      j = j === null ? m.k - 2 : Math.min(j, m.k - 2)
      const c1 = successor(joins(m.a.a, m.a.b, m.a.c, m.a.d), j)
      const c2 = successor(joins(m.a.b, m.b.a, m.a.d, m.b.c), j)
      const c3 = successor(joins(m.b.a, m.b.b, m.b.c, m.b.d), j)
      const c4 = successor(joins(m.a.c, m.a.d, m.c.a, m.c.b), j)
      const c5 = successor(joins(m.a.d, m.b.c, m.c.b, m.d.a), j)
      const c6 = successor(joins(m.b.c, m.b.d, m.d.a, m.d.b), j)
      const c7 = successor(joins(m.c.a, m.c.b, m.c.c, m.c.d), j)
      const c8 = successor(joins(m.c.b, m.d.a, m.c.d, m.d.c), j)
      const c9 = successor(joins(m.d.a, m.d.b, m.d.c, m.d.d), j)

      if (j < m.k - 2) {
         s = joins(
            joins(c1.d, c2.c, c4.b, c5.a),
            joins(c2.d, c3.c, c5.b, c6.a),
            joins(c4.d, c5.c, c7.b, c8.a),
            joins(c5.d, c6.c, c8.b, c9.a),
         )
      } else {
         s = joins(
            successor(joins(c1, c2, c4, c5), j),
            successor(joins(c2, c3, c5, c6), j),
            successor(joins(c4, c5, c7, c8), j),
            successor(joins(c5, c6, c8, c9), j),
         )
      }
      return s
   }
}
