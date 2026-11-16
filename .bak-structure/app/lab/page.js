import AgentDemo from '@/components/AgentConsole';
import { withOG } from '@/lib/seo';
import Link from 'next/link';
import { Bg, Interlude, VBand, VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { DemoSection } from '@/components/DemoWindow';
import { NeuralCanvas, EvalLab, RagViz, RoiCalc } from '@/components/Labs';
import { AssistantDemo, TrainingPlayground, BenchmarkConsole, ExtractDemo } from '@/components/Demos';
export const metadata = withOG({ title: 'AI Lab: live demos', description: 'Try a chatbot, train a model, build a benchmark and extract data from documents, live in your browser.', alternates: { canonical: '/lab' } });
const blocks = [
 ['assistant','knowledge','assistant','Assistants and chatbots','Chat with an assistant that cites its sources.','Real retrieval over a sample knowledge base. Switch between a customer-support bot and an internal HR assistant.','Knowledge assistant','Cited answers · human hand-off',['AI chatbot development','/solutions/ai-chatbot-development'],<AssistantDemo/>],
 ['training','contour','training','Model training','Train a neural network and watch it learn.','Real backpropagation in your browser. Try to make it overfit, then fix it.','Model training console','Live backpropagation',['Fine-tuning and custom models','/solutions/fine-tune-small-language-model'],<TrainingPlayground/>],
 ['benchmark','matrix','bench','Evaluation and benchmarks','Build a leaderboard, then review like an expert.','Re-weight what matters and watch the ranking change. Then do blind A/B human review against gold labels.','Benchmark console','Leaderboard · blind A/B review',['LLM evaluation','/solutions/llm-evaluation-services'],<BenchmarkConsole/>],
 ['documents','extract','extract','Document AI','Turn messy documents into structured data.','Edit the text and the extraction updates live, with validation checks and human-review flags.','Document extraction','Fields, validation, review flags',['AI development','/services/ai-development'],<ExtractDemo/>],
 ['agents','flow','agent','Agents','Watch an agent reason and call tools.','Pick a scenario and follow every step.','Operations agent','Tool calls with approval gates',['AI agent development','/solutions/ai-agent-development-services'],<AgentDemo/>],
 ['suite','matrix','eval','Evaluation suite','Run a 40-case evaluation suite.','Compare three models across test cases and see regressions.','Evaluation suite','40 test cases · 3 models',['LLM evaluation','/solutions/llm-evaluation-services'],<EvalLab/>],
 ['retrieval','space','rag','Retrieval','See how retrieval-augmented generation works.','From documents to a cited answer.','Retrieval pipeline','Document to cited answer',['RAG development','/solutions/rag-development-services'],<RagViz/>],
 ['impact','ledger','roi','Impact','Estimate what automation could free up.','Use your own numbers.','Impact calculator','Hours and cost, from your numbers',['AI strategy','/services/ai-strategy'],<RoiCalc/>]];
const TRY = {assistant:'Ask “Is our data safe with you?”, then open the Knowledge tab and add your own document.',training:'Raise the learning rate until training becomes unstable, then lower it.',benchmark:'Move a weight slider and watch the ranking reorder, then review an A/B pair blind.',documents:'Delete a value from the text and watch the check flag it for human review.',agents:'Choose a scenario, then expand a step to see its input and output.',suite:'Hover a cell to read its test case. Pass rates are a simulation, not published results.',retrieval:'Click a stage to pause it. Hover to hold the animation.',impact:'Use your own monthly volume and average handling time.'};
export default function Lab() {
  return (<>
    <section className="page" style={{position:'relative',overflow:'hidden',minHeight:440}}><Bg name={pageVideo(3)} dim={0.72} side /><NeuralCanvas/><div className="wrap" style={{position:'relative'}}><h1>Try the work before you buy it.</h1><p className="lead">Chatbots, model training, benchmarks and document AI, running live in your browser. Move the mouse over the network and click to send a signal.</p><Link className="btn p" href="/contact">Build something with us</Link></div></section>
    <nav className="lsub">{[['assistant','Chatbots'],['training','Training'],['benchmark','Benchmarks'],['documents','Documents'],['agents','Agents'],['impact','Impact']].map(([h,l])=><a key={h} href={`#${h}`}>{l}</a>)}</nav>
    {blocks.map(([id,theme,icon,e,t,x,wt,ws,svc,c],i)=><DemoSection key={id} id={id} video={pageVideo(5 + i)} theme={theme} icon={icon} title={t} text={x} wtitle={wt} wsub={ws} svc={svc} seeing={x} tryit={TRY[id]}>{c}</DemoSection>)}
    <VCta video={pageVideo(2)} title="Liked what you tried? We build it on your data." text="Tell us the problem. An engineer replies within 24 hours with a written plan: scope, timeline and cost." label="Get my free AI plan" /></>);
}
