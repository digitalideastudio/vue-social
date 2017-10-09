module.exports = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

    setCssText(obj) {
        const cssArr = [];

        if (obj) {
            Object.keys(obj).forEach((key) => {
                let val = obj[key];
                if (typeof val === 'number') {
                    val = `${val}px`;
                }
                cssArr.push(`${key}: ${val};`);
            });
        }

        return cssArr.join('');
    },
};
