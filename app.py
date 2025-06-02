from flask import Flask, render_template, send_from_directory, request, abort
from flask_mail import Mail, Message
import json
import os
import glob
from dotenv import load_dotenv

load_dotenv()  # Carrega variáveis de ambiente do .env

app = Flask(__name__)

# Configuração de e-mail (Hostinger)
app.config['MAIL_SERVER'] = 'smtp.hostinger.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  # Ex: contato@defogdesign.com
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')  # Senha do e-mail

mail = Mail(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/prova-social')
def provasocial():
    return render_template('prova-social.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/contato', methods=['GET', 'POST'])
def contato():
    if request.method == 'POST':
        nome = request.form['nome']
        email = request.form['email']
        whatsapp = request.form['whatsapp']
        empresa = request.form['empresa']
        tamanho_empresa = request.form['tamanho_empresa']
        instagram = request.form['instagram']
        segmento = request.form['segmento']
        produtos = request.form['produtos']
        tempo_mercado = request.form['tempo_mercado']
        origem = request.form['origem']
        mensagem_extra = request.form['mensagem_extra']

        # Monta o conteúdo do e-mail
        corpo_email = f"""
        Nome: {nome}
        E-mail: {email}
        WhatsApp: {whatsapp}
        Empresa: {empresa}
        Tamanho da Empresa: {tamanho_empresa}
        Instagram: {instagram}
        Segmento: {segmento}
        Produtos/Serviços: {produtos}
        Tempo de Mercado: {tempo_mercado}
        Como nos encontrou: {origem}
        Mensagem extra: {mensagem_extra}
        """

        msg = Message('Novo Contato pelo Site',
                      sender=app.config['MAIL_USERNAME'],
                      recipients=['contato@defogdesign.com'])  # Pode colocar outros e-mails aqui

        msg.body = corpo_email

        try:
            mail.send(msg)
            return render_template('contato.html', mensagem="Mensagem enviada com sucesso!")
        except Exception as e:
            print(f"Erro ao enviar e-mail: {e}")
            return render_template('contato.html', mensagem="Erro ao enviar sua mensagem.")

    return render_template('contato.html')

def get_projetos():
    """Função auxiliar para obter a lista de projetos"""
    projetos = []
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_files = glob.glob(os.path.join(base_dir, 'projetos_json', '*.json'))

    for json_file in json_files:
        nome_base = os.path.splitext(os.path.basename(json_file))[0]
        img_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']
        img_path = None

        for ext in img_extensions:
            possible_path = os.path.join(base_dir, 'static', 'img_projetos', f'{nome_base}{ext}')
            if os.path.exists(possible_path):
                img_path = f'img_projetos/{nome_base}{ext}'
                break

        projetos.append({
            'nome': nome_base,
            'link': f'/{nome_base}',
            'imagem': img_path or 'img_projetos/padrao.jpg'
        })

    return projetos

@app.route('/projetos')
def projetos():
    return render_template('projetos.html', projetos=get_projetos())

@app.route('/<projeto_nome>')
def projeto(projeto_nome):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    caminho = os.path.join(base_dir, 'projetos_json', f'{projeto_nome}.json')

    print(f"Caminho corrigido: {caminho}")

    if not os.path.exists(caminho):
        abort(404)

    with open(caminho, 'r', encoding='utf-8') as f:
        conteudo = json.load(f)

    return render_template('projeto.html', conteudo=conteudo, projetos=get_projetos())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
