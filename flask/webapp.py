from flask import Flask, url_for, render_template, redirect, request, send_from_directory
app = Flask(__name__)

@app.route('/')
def Landing():
    return render_template('Landing.html')

@app.route('/profile/<profileID>')
def ProfileView(profileID):
    print(profileID)
    return render_template('Landing.html')

@app.route('/customizer')
def Customization():
    return render_template('Customization.html')

@app.route('/dev')
def Dashboard():
    return render_template('dashboard.html')

@app.route('/svg/<fname>')
def SVGTest(fname):
    return send_from_directory('static', fname+'.svg')
