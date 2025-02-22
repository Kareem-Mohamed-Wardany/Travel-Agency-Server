const ApiResponse = require("../../custom-response/ApiResponse");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../../errors')
const User = require("../../models/User");

//register
const registerUser = async (req, res) => {
  const user = await User.create({ ...req.body })

  const response = new ApiResponse({
    msg: 'User created successfully',
    data: null,
    success: true,
    statusCode: StatusCodes.CREATED
  })
  res.status(response.statusCode).json(response);

}


//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please fill all fields")
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Please enter valid credentials")
  }

  const checkPasswordMatch = await user.comparePassword(password, user.password);
  if (!checkPasswordMatch)
    throw new UnauthenticatedError("Please enter valid credentials")

  const token = user.createJWT()
  const response = new ApiResponse({
    msg: 'User logged in successfully',
    data: {
      user: {
        id: user._id,
        userName: user.fullName,
        role: user.role,
      },
      token: token,

    },
    success: true,
    statusCode: StatusCodes.OK
  })

  res.status(response.statusCode).json(response);
}


module.exports = { registerUser, loginUser };
