/* migrated from config/filesystems.php */

export default {
  default: process.env.FILESYSTEM_DISK ?? 'local',

  disks: {
    local: {
      driver: 'local',
      root: 'app/private', // TODO: Resolve this path (e.g., path.join(process.cwd(), 'storage', 'app', 'private'))
      serve: true,
      throw: false,
      report: false,
    },

    public: {
      driver: 'local',
      root: 'app/public', // TODO: Resolve this path (e.g., path.join(process.cwd(), 'storage', 'app', 'public'))
      url: (process.env.APP_URL ?? '') + '/storage',
      visibility: 'public',
      throw: false,
      report: false,
    },

    s3: {
      driver: 's3',
      key: process.env.AWS_ACCESS_KEY_ID ?? null,
      secret: process.env.AWS_SECRET_ACCESS_KEY ?? null,
      region: process.env.AWS_DEFAULT_REGION ?? null,
      bucket: process.env.AWS_BUCKET ?? null,
      url: process.env.AWS_URL ?? null,
      endpoint: process.env.AWS_ENDPOINT ?? null,
      use_path_style_endpoint: process.env.AWS_USE_PATH_STYLE_ENDPOINT === 'true',
      throw: false,
      report: false,
    },
  },

  links: {
    'public/storage': 'app/public', // TODO: This represents symbolic links. Needs specific Node.js implementation for creation/management, if required.
  },
};
