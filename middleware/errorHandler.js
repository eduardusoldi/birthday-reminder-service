const errorHandler = (err, req, res, next) => {
    // Log the error (you can use any logger here)
    console.error(err);

    // Check for validation errors
    if (err.name === 'ValidationError') {
        const errorMessages = Object.values(err.errors).map(error => {

            switch (error.path) {
                case 'email':
                    return 'The email format is invalid';
                case 'birthday':
                    return 'The birthday format is invalid';
                case 'timezone':
                    return 'The timezone must be a valid IANA timezone';
                default:
                    return error.message;
            }
        });

        return res.status(400).json({
            message: errorMessages.join(', ')
        });
    }

    // Check for invalid ID format
    if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid ID format." })
    }

    // Check for duplicate email error
    if (err.code === 11000) {
        return res.status(400).json({
            message: `The email ${err.keyValue.email} is already taken. Please choose a different email.`,
        });
    }

    if (err) {
        return res.status(err.status).json({
            message: err.msg
        })
    }
    
    return res.status(500).json({
        message: 'Internal Server Error',
    });
};

module.exports = errorHandler;
