import { joinRoom } from './src/lib/actions.js'

async function run() {
  try {
    await joinRoom('cmtgsqnpd0000wjwo2mntpzpu', 'TestUser', '123e4567-e89b-12d3-a456-426614174000')
    console.log('Success')
  } catch(e) {
    console.error('FAILED', e)
  }
}
run()
