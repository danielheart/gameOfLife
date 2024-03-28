const resolution = 10
const on = new Nodetree(0, null, null, null, null, 1, 1)
const off = new Nodetree(0, null, null, null, null, 0, 0)
let nodes
function setup() {
   createCanvas(windowWidth, windowHeight)
   background(27)
   fill(80)
   noStroke()
   rectMode(CENTER)
   textAlign(CENTER)

   translate(floor(width / 2), floor(height / 2))
   frameRate(1)
   nodes = get_random(4)
   nodes.render(0, 0)
}
function draw() {
   nodes = centre(life_4x4(nodes))
   nodes.render(0, 0)
   text(floor(frameRate()), 20, 50)
   noLoop()
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
