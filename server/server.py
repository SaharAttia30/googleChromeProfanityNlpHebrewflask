
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # or any {'0', '1', '2'}
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask import Flask, request
import pickle
from keras.models import load_model
from flask import Flask

def swearornot(model,tokenizer,sentences):
  trunc_type='post'
  padding_type='post'
  sequences = tokenizer.texts_to_sequences(sentences)
  padded = pad_sequences(sequences, maxlen=100, padding=padding_type, truncating=trunc_type)
  res = (model.predict(padded))
  return res
def do_predict(lines):
  model = load_model('model.h5')
  with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)
  arr_to_train_tmp = lines.split(":")
  arr_to_train_tmp1 = arr_to_train_tmp[1]
  arr_to_train_str = arr_to_train_tmp1[1:-2]
  arr_to_train = arr_to_train_str.split(",")
  res = swearornot(model, tokenizer, arr_to_train)
  tol =[]
  for i in range(len(res)):
    if res[i] > 0.5:
      tol.append(1)
    else:
      tol.append(0)
  res = ""
  for f in range(len(tol)):
    if f == len(tol) -1:
      res += str(tol[f])
      continue
    res += str(tol[f]) + ","
  return res

app = Flask(__name__)

@app.route('/',methods=['POST'])
def query_example():
  req_text = request.get_data().decode('utf-8')
  res = do_predict(req_text)
  return res

if __name__ == '__main__':
    app.run(debug=True,host='127.0.0.1',port=3000)
