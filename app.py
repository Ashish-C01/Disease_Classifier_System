from flask import Flask,render_template,request
import numpy as np
import logging
from sklearn.preprocessing import StandardScaler
import pandas as pd
import pickle
from tensorflow.keras import models
logging.getLogger("tensorflow").setLevel(logging.WARNING)
import tensorflow as tf
import cv2



app=Flask(__name__)

@app.route('/',methods=["GET"])
@app.route('/intro.html')
def index():
    return render_template('intro.html')

@app.route('/predict.html')
def predict():
    return render_template('index.html')


@app.route('/malaria.html',methods=['GET'])
def page1():
    return render_template('malaria.html')

@app.route('/heart.html',methods=['GET'])
def page2():
    return render_template('heart_attack.html')

@app.route('/pneumonia.html',methods=['GET'])
def page3():
    return render_template('pneumonia.html')

@app.route('/liver.html')
def page4():
    return render_template('liver.html')




@app.route('/malaria-classifier',methods=["POST"])
def malaria_classifier():

    model=tf.keras.models.load_model('model/malaria_model.h5')

    #read image file string data
    filestr = request.files['myfile'].read()
    #convert string data to numpy array
    npimg = np.frombuffer(filestr, np.uint8)
    #convert numpy array to image
    img = cv2.imdecode(npimg, cv2.IMREAD_ANYCOLOR)
    img=cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img=cv2.resize(img,(64,64))
    img=np.reshape(img,(-1,64,64,3))
    img=img/255
    predict=model.predict(img)

    if predict>=0:
        msg="uninfected"
    else:
        msg="infected"

    return {"result":msg} 


@app.route('/pneumonia-classifier',methods=["POST"])
def pneumonia_classifier():

    model=tf.keras.models.load_model('model/Lungs_modified_with_precision.h5')

    #read image file string data
    filestr = request.files['myfile1'].read()
    #convert string data to numpy array
    npimg = np.frombuffer(filestr, np.uint8)
    # convert numpy array to image
    img = cv2.imdecode(npimg, cv2.IMREAD_ANYCOLOR)
    img=cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img=cv2.resize(img,(200,200))
    img=np.reshape(img,(-1,200,200,3))
    img=img/255
    predict=model.predict(img)
    labels = 1*(predict > 0.45)
    if labels:
        msg='Pneumonia'
    else:
        msg='Normal'

    return {"result":msg} 

@app.route('/test_liver',methods=['POST'])
def liver():
    model=tf.keras.models.load_model('model/liver_model.h5')
    data=request.json
    age=data['Age']
    gender=data['Gender']
    total_b=data['Total_b']
    Alkaline_p=data['Alkaline_p']
    Alamine_a=data['Alamine_a']
    total_protien=data['Total_protien']
    albumin_g=data['Albumin_g']
    value=np.array([age,gender,total_b,Alkaline_p,Alamine_a,total_protien,albumin_g])
    value=value.reshape(-1,7)
    scaler=StandardScaler()
    df=pd.read_csv('model/indian_liver_patient.csv')
    df['Gender']=np.where(df['Gender']=='Female',1,0)
    X=df[['Age', 'Gender', 'Total_Bilirubin', 
       'Alkaline_Phosphotase', 'Alamine_Aminotransferase', 'Total_Protiens','Albumin_and_Globulin_Ratio']]
    scaler.fit(X)
    value=scaler.transform(value)
    pred=model.predict(value)
    pred=pred*100
    val=str(pred)[2:-2]
    return {"result":val}

@app.route('/test_heart',methods=['POST'])
def heart():
    model=pickle.load(open('model/finalized_model(heart).sav','rb'))
    data=request.json
    age=data['Age']
    gender=data['Gender']
    cp=data['CP']
    trtbps=data['trtbps']
    cholestrol=data['Cholestrol']
    fbs=data['FBS']
    rest_ecg=data['Rest_ECG']
    thallachh=data['Thallachh']
    exng=data['EXNG']
    oldpeak=data['OldPeak']
    slp=data['SLP']
    caa=data['CAA']
    thal=data['Thal']
    value=np.array([age,gender,cp,trtbps,cholestrol,fbs,rest_ecg,thallachh,exng,oldpeak,slp,caa,thal])
    value=value.reshape(-1,13)
    scaler=StandardScaler()
    df=pd.read_csv('model/heart.csv')
    X=df.drop('output',axis=1)
    scaler.fit(X)
    value=scaler.transform(value)
    pred=model.predict(value)
    # pred=pred*100
    # pred=pred[1]
    # val=str(pred)[2:-2]
    # print(pred)
    if pred==1:
        msg="The chance of getting heart attack is high"
    else:
        msg="The chance of getting heart attack is low"



    return {"result":msg}


if __name__=='__main__':
    app.run(debug=False)

