from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    # PythonAnywhere වලදී ඇත්තම IP එක ගන්න ක්‍රමය
    user_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if user_ip and ',' in user_ip:
        user_ip = user_ip.split(',')[0]
    return render_template('index.html', ip=user_ip)

if __name__ == '__main__':
    app.run()