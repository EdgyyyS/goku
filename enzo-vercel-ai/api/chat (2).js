export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  const msg = message.toLowerCase();

  // RESPOSTA COMERCIAL FIXA
  if (
    msg.includes("serviço") ||
    msg.includes("servicos") ||
    msg.includes("trabalho") ||
    msg.includes("portfolio")
  ) {
    return res.status(200).json({
      reply: `Olá! 👋  
Obrigado pelo contato e pelo interesse no meu trabalho.

Atuo como designer freelancer, desenvolvendo projetos voltados principalmente para:
• Thumbnails e capas para YouTube  
• Design para redes sociais  
• Identidade visual  
• Interfaces web (UI / Frontend)

Meu processo de trabalho é simples e transparente:
1) Entendimento da sua necessidade  
2) Proposta visual + prazo  
3) Ajustes alinhados com o feedback  
4) Entrega final organizada e pronta para uso

Se quiser, me conte um pouco sobre o que você deseja desenvolver.`
    });
  }

  // RESPOSTA NORMAL DA IA
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é a IA comercial do Enzo. Designer freelancer. Linguagem profissional, clara e focada em conversão."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

