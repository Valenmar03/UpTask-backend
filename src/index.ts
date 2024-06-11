import server from './server';
import colors from 'colors'

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(colors.magenta.bold(`Listening on port ${port}`))
})