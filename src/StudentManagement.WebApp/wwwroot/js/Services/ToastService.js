
app.service('ToastService', ['$timeout', function ($timeout) {
        var self = this;

        // Hàm hiển thị toast
        this.show = function (message, type, duration) {
            type = type || 'info'; // success, error, warning, info
            duration = duration || 3000;

            // Tạo toast container nếu chưa có
            var container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.className = 'toast-container';
                document.body.appendChild(container);
            }

            // Tạo toast element
            var toast = document.createElement('div');
            toast.className = 'toast toast-' + type + ' show';

            // Icon theo loại
            var icon = {
                'success': 'fa-check-circle',
                'error': 'fa-times-circle',
                'warning': 'fa-exclamation-triangle',
                'info': 'fa-info-circle'
            };

            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="fas ${icon[type]}"></i>
                </div>
                <div class="toast-content">
                    <div class="toast-message">${message}</div>
                </div>
                <button class="toast-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;

            container.appendChild(toast);

            // Tự động ẩn sau duration
            $timeout(function () {
                toast.classList.remove('show');
                $timeout(function () {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, duration);
        };

        // Các hàm shorthand
        this.success = function (message, duration) {
            this.show(message, 'success', duration);
        };

        this.error = function (message, duration) {
            this.show(message, 'error', duration);
        };

        this.warning = function (message, duration) {
            this.show(message, 'warning', duration);
        };

        this.info = function (message, duration) {
            this.show(message, 'info', duration);
        };
    }]);