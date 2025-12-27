export default defineAppConfig({
  global: {
    picture: {
      dark: '/avatar/avatar.png',
      light: '/avatar/avatar.png',
      alt: 'My profile picture'
    },
    githubLink: 'https://github.com/nam-ruto',
    email: 'namhd.work@gmail.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'teal',
      neutral: 'slate'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    // credits: `Built with Nuxt UI • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-discord',
      'to': 'https://discord.com/users/882322313918418984',
      'target': '_blank',
      'aria-label': 'Nam Hoang on Discord'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/nam-hd/',
      'target': '_blank',
      'aria-label': 'Nam Hoang on LinkedIn'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/nam-ruto',
      'target': '_blank',
      'aria-label': 'Nam Hoang on GitHub'
    }]
  }
})
