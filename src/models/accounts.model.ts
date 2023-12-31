// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '../declarations'
import { HookReturn } from 'sequelize/types/hooks'
import createVerificationToken from '../misc/create-verification-token'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const accounts = sequelizeClient.define('accounts', {
    avatar: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lang: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'en'
    },
    locked: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    verificationToken: {
      type: DataTypes.UUID,
      defaultValue: () => createVerificationToken(16)
    }
  }, {
    hooks: {
      beforeCount (options: any): HookReturn {
        options.raw = true
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (accounts as any).associate = function (models: any): void {
    // accounts.hasOne(models.author_applications)
    // accounts.hasOne(models.user_appearance_prefs)
    // accounts.hasOne(models.user_media_prefs)
    // accounts.hasMany(models.courses)
    accounts.hasMany(models.flags, {
      foreignKey: 'authorId'
    })
    accounts.hasMany(models.flag_answers, {
      foreignKey: 'authorId'
    })
  }

  return accounts
}
