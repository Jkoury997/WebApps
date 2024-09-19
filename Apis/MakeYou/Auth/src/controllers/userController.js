

const utilsApi = require("../utils/utilsApi")

// controllers/userController.js
const { registerUser,loginUser,getClientIp,logoutUser,getUserService,getUserByEmailService,getAllUsers} = require('../services/userService');
const { generateAccessToken, generateRefreshToken,revokeTokens} = require('../services/tokenService');


const register = async (req, res) => {
    try {
      const { firstName, lastName, dni, email, password, sex } = req.body;


  
      // Realizar login y obtener la clave de acceso
      const accessKeyApi = await utilsApi.loginJinx();
      if (!accessKeyApi.AccessKey) {
        throw new Error('Login failed');
      }
  
      // Obtener el token de acceso
      const TokenApi = await utilsApi.userAccess(accessKeyApi.AccessKey);
      if (!TokenApi.Token) {
        throw new Error('User access failed');
      }
  
      // Verificar si el usuario ya existe
      const existEmployerApi = await utilsApi.checkUserApi(dni, TokenApi.Token);
      if (!existEmployerApi) {
        throw new Error('No se encontro el dni en el sistema');
      }


      // Si todo es correcto, proceder con el registro del usuario
      const role = 'employed'; // Rol por defecto
      const { user, deviceUUID } = await registerUser({ firstName, lastName, dni, email, password, role, sex });
  


      res.status(201).json({ message: 'User registered successfully', user, deviceUUID });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  


const login = async (req, res) => {
    try {
        const { email, password} = req.body;
        const user = await loginUser(email, password);
        console.log(user)
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const ip = getClientIp(req);
        const role = user.role; // Asumiendo que el rol está en el usuario
        console.log(role)
        const accessToken = await generateAccessToken(user._id, user.uuid, role);
        const refreshToken = await generateRefreshToken(user.uuid, role, ip);

        res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        await logoutUser(refreshToken);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error });
    }
};

const revokeAllTokens = async (req, res) => {
    const { userUuid } = req.body;

    if (!userUuid) {
        return res.status(400).json({ message: 'User UUID is required' });
    }

    try {
        await revokeTokens(userUuid);
        res.status(200).json({ message: 'All tokens revoked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error revoking tokens', error });
    }
};

async function getUser(req, res) {
    try {
      const user = await getUserService(req.params.useruuid);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  
  async function listAll(req, res) {
    try {
      const users = await getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async function getUserByEmail(req, res) {
    try {
      const user = await getUserByEmailService(req.params.email);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }


const updateUser = async (req, res) => {
    const useruuid = req.params.uuid;
    const updateData = req.body;

    try {
        const updatedUser = await userService.updateUser(useruuid, updateData);
        res.status(200).json({ message: 'Usuario actualizado', user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deactivateUser = async (req, res) => {
    const useruuid = req.params.uuid;

    try {
        const deactivatedUser = await userService.deactivateUser(useruuid);
        res.status(200).json({ message: 'Usuario desactivado', user: deactivatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    logout,
    revokeAllTokens,
    getUser,
    getUserByEmail,
    updateUser,
    deactivateUser,
    listAll
};