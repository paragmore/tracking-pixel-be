const fastify = require('fastify')({ logger: true, trustProxy: true });
const mongoose = require('mongoose')
const { createCanvas } = require('canvas')
const User = require('./models/user.model.js')
const View = require('./models/view.model.js')

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tracker'
const PORT = process.env.PORT || 3000

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

fastify.post('/register', async (request, reply) => {
  const { username, githubUsername } = request.body

  const user = new User({ username, githubUsername })
  await user.save()
  const serverUrl = `${request.protocol}://${request.hostname}`

  reply.send({
    message: 'User registered successfully',
    trackingUrl: `${serverUrl}/track/${githubUsername}`
  })
})

fastify.get('/track/:githubUsername', async (request, reply) => {
  const { githubUsername } = request.params
  const referer = request.headers.referer || ''


  // if (!referer.startsWith(`https://github.com/${githubUsername}`)) {
  //   reply.code(403).send('Forbidden')
  //   return
  // }

  const ip = request.ip

  let view = await View.findOne({ githubUsername, ip })
  if (view) {
    view.views += 1
    view.lastVisit = new Date()
  } else {
    view = new View({ githubUsername, ip })
  }
  await view.save()

  const uniqueVisitors = await View.countDocuments({ githubUsername })

  const image = generateImage(uniqueVisitors)
  reply.header('Content-Type', 'image/png').send(image)
})

fastify.get('/stats/:githubUsername', async (request, reply) => {
  const { githubUsername } = request.params
  const views = await View.find({ githubUsername })

  reply.send(views)
})

function generateImage (viewCount) {
  const canvas = createCanvas(200, 50)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#FFF'
  ctx.fillRect(0, 0, 200, 50)

  ctx.fillStyle = '#000'
  ctx.font = '12px Arial'
  ctx.fillText(`Views: ${viewCount}`, 10, 35)

  return canvas.toBuffer('image/png')
}

fastify.listen(PORT, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`Server running at ${address}`)
})
