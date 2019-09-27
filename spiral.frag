#define M_PI 3.1415926535897932384626433832795
#define M_2PI M_PI * 2.
#define M_HPI M_PI / 2.
#define M_E exp(1.)

float amplitude = 0.0;
float pshift = 0.0;
float frequency = 8.0;
float vshift = 0.0;
float ratio = 0.5;


float tri_amplitude = 1.;
float tri_pshift = 0.0;
float tri_frequency = 2.0;
float tri_vshift = 0.0;


float patternh = .36;
float bandh = .08;
float bandh_m_amplitude = .06;
float bandh_m_frequency = .5;
float amplitude_m_amplitude = .25;
float amplitude_m_frequency = .125;
float ratio_m_amplitude = .125;
float ratio_m_frequency = .25;
float pshift_m_speed = 1.;
float vshift_m_speed = -.25;

vec3 cB = vec3(0.0, 0.0, 0.0); //black
vec3 cM = vec3(1.0, 0.0, 1.0); //magenta
vec3 cC = vec3(0.0, 1.0, 1.0); //cyan
vec3 cW = vec3(1.0, 1.0, 1.0); //white

float tempo = .5;

float pulse(float x) {
	float b = frequency * 1.;
	float c = pshift * 1.;
	return amplitude * floor(fract((x * b) + c) - ratio) + vshift;

}

float triangle(float x) {
	float b = tri_frequency * 1.;
	float c = tri_pshift * 1.;
	return tri_amplitude * abs(2.0 * fract((x * b) + c) - 1.0) + tri_vshift;
}

vec3 colorB() {
	return cB;
}


vec3 colorW () {
    
    float fr = triangle(iTime*36.);
    
    if (fr <= .5) { return cM; }
    else if (fr <= 1.) { return cC; } 
}

vec3 colorBW(float bw) {
	float black = (bw - 1.) * -1.;
    float white = bw;
    vec3 blackColor = colorB().xyz * black;
    vec3 whiteColor = colorW().xyz * white;
    return blackColor + whiteColor;
}

float eval(vec2 rt) {
	float fx = (rt.x -.5) - pulse(rt.y);
	float dist = mod((rt.y - fx), patternh);
	return step(dist, bandh);
}

void update() {
	bandh+=sin(iTime*bandh_m_frequency)*bandh_m_amplitude;
    pshift+=iTime * pshift_m_speed;
    vshift+=iTime * vshift_m_speed;
    amplitude+=amplitude_m_amplitude*sin(iTime*amplitude_m_frequency);
    ratio += ratio_m_amplitude*sin(iTime*ratio_m_frequency);
    
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
	vec2 pos = vec2(0.5) - (fragCoord.xy/iResolution.xy);
	vec2 rt = vec2(length(pos)*2.,atan(pos.y,pos.x) / M_2PI); // radius & normalized theta
    
	update();
    
	vec3 color = colorBW(eval(rt));
	
	fragColor = vec4(color,1.);
}
