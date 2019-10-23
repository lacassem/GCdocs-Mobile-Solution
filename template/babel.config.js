module.exports = {
    'presets': [[
        '@babel/preset-env', {
            'useBuiltIns': 'usage',
            'corejs': '2',
            'targets': {
                'browsers': ['> 1%', 'last 2 versions']
            }
        }
    ]],
};